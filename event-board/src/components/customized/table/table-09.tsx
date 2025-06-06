"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type Participante = {
  id: string;
  Email: string;
  Nombre: string;
  EventoID: number;
  tipo_asistencia: "Presencial" | "Virtual";
};

export const columns: ColumnDef<Participante>[] = [
  {
    accessorKey: "Nombre",
    header: "Name",
    cell: ({ row }) => <div>{row.getValue("Nombre")}</div>,
  },
  {
    accessorKey: "Email",
    header: "Email",
    cell: ({ row }) => <div className="lowercase">{row.getValue("Email")}</div>,
  },
  {
    accessorKey: "tipo_asistencia",
    header: "Tipo de Asistencia",
    cell: ({ row }) => <div>{row.getValue("tipo_asistencia")}</div>,
  },
  /*
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const participante = row.original;
      
      return (
        <Button
          size="sm"
          onClick={() => handleDeleteParticipant(participante.id)}
          className="text-white bg-red-600 hover:bg-red-700"
        >
          Borrar
        </Button>
      );
    },
  },
  */
];

export default function DataTableDemo() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [participantes, setParticipantes] = useState<Participante[]>([]);

  // Inputs
  const [email, setEmail] = useState<string>("");
  const [nombre, setNombre] = useState<string>("");
  const [eventoID, setEventoID] = useState<number>(0);
  const [tipoAsistencia, setTipoAsistencia] = useState<"Presencial" | "Virtual">("Presencial");
  const slug = useParams().id;

  const handleDeleteParticipant = async (participantId: string) => {
    // Show confirmation dialog
    const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar este participante?");
    
    if (!confirmDelete) {
      return; // User cancelled
    }

    try {
      const { error } = await supabase
        .from("Participante")
        .delete()
        .eq("id", participantId);

      if (error) {
        console.error("Error deleting participant:", error);
        alert(`Error: ${error.message}`);
      } else {
        console.log("Participant deleted successfully");
        alert("Participante eliminado");
        // The real-time subscription will automatically update the UI
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Error al eliminar participante");
    }
};

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from("Participante")
        .select(`*`)
        .eq("EventoID", slug);

      if (error) {
        console.error("Error fetching data: ", error);
      } else {
        setParticipantes(data || []);
      }
    };

    fetchUsers();

    const participanteChannel = supabase
      .channel("participante-channel")
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "Participante",
      }, (payload) => {
        console.log("New Participante: ", payload);
        setParticipantes((prevParticipantes) => [payload.new, ...prevParticipantes]);
      })
      .on("postgres_changes", {
        event: "UPDATE",
        schema: "public",
        table: "Participante",
      }, (payload) => {
        console.log("Updated Participante: ", payload);
        setParticipantes((prevParticipantes) => {
          return prevParticipantes.map((participante) =>
            participante.id === payload.new.id ? payload.new : participante
          );
        });
      })
      .on("postgres_changes", {
        event: "DELETE",
        schema: "public",
        table: "Participante",
      }, (payload) => {
        console.log("Deleted Participante: ", payload);
        setParticipantes((prevParticipantes) =>
          prevParticipantes.filter((participante) => participante.id !== payload.old.id)
        );
      })
      .subscribe();

    return () => {
      participanteChannel.unsubscribe();
    };
  }, []);

  // Agregar o Modificar Participante
  const handleAddOrUpdateUser = async () => {
  if (email && nombre && tipoAsistencia) {
    try {
      const { data, error } = await supabase
        .from("Participante")
        .upsert({
          Email: email,
          Nombre: nombre,
          EventoID: slug,
          tipo_asistencia: tipoAsistencia
        }, {
          onConflict: 'Nombre,EventoID'
        })
        .select();

      if (error) {
        console.error("Error upserting user:", error);
        alert(`Error: ${error.message}`);
      } else {
        console.log("User upserted successfully:", data);
        // Resetear los campos después de insertar o modificar
        setEmail("");
        setNombre("");
        setEventoID(0);
        setTipoAsistencia("Presencial");
        alert("Participante agregado/modificado con éxito");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Error al agregar/modificar participante");
    }
  } else {
    alert("Por favor llene todos los campos.");
  }
};

  const table = useReactTable({
    data: participantes,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="mr-10 ml-10">
      <div className="flex items-center gap-2 py-4">
        <Input
          placeholder="Filtra por nombre"
          value={(table.getColumn("Nombre")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("Nombre")?.setFilterValue(event.target.value)
          }
          className="max-w-sm text-white"
        />
      </div>

      <div className="rounded-md border text-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead className="text-white font-bold" key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2 text-white">
          <span>Nombre:</span>
          <input 
            value={nombre}
            onChange={(e) => setNombre(e.target.value)} 
            className="border-[1px] rounded-sm text-white px-2 py-1 placeholder-gray-400 mb-5" 
            name="newName"
            placeholder="Enter name"
          />
          
          <span>Email:</span>
          <input 
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            className="border-[1px] rounded-sm text-white px-2 py-1 placeholder-gray-400 mb-5" 
            name="newEmail"
            type="email"
            placeholder="Enter email"
          />
          
          <span>Attendance:</span>
          <select 
            value={tipoAsistencia}
            onChange={(e) => setTipoAsistencia(e.target.value as "Presencial" | "Virtual")} 
            className="border-[1px] text-white rounded-sm px-2 py-1 placeholder-gray-400 mb-5"
          >
            <option value="Presencial">Presencial</option>
            <option value="Virtual">Virtual</option>
          </select>
          
          <Button
            className="text-black cursor-pointer"
            variant="outline"
            size="sm"
            onClick={handleAddOrUpdateUser}
            disabled={false}
          >
            Agregar/Modificar
          </Button>
        </div>
      </div>
    </div>
  );
}
