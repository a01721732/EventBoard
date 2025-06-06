"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

import EventCard from "./customized/card/event-card";

const EventoList = () => {
  const [eventos, setEventos] = useState([]);

  const [newEventName, setNewEventName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch the data initially
    const fetchEventos = async () => {
      const { data, error } = await supabase
        .from("Evento")
        .select("*");

      if (error) {
        console.error("Error fetching data:", error);
      } else {
        setEventos(data);
        console.log(data)
      }
    };

    fetchEventos();

    const eventoChannel = supabase
      .channel("evento-channel")
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "Evento",
      }, (payload) => {
        console.log("New Evento: ", payload);
        setEventos((prevEventos) => [payload.new, ...prevEventos]);
      })
      .on("postgres_changes", {
        event: "UPDATE",
        schema: "public",
        table: "Evento",
      }, (payload) => {
        console.log("Updated Evento: ", payload);
        setEventos((prevEventos) => {
          return prevEventos.map((evento) =>
            evento.id === payload.new.id ? payload.new : evento
          );
        });
      })
      .on("postgres_changes", {
        event: "DELETE",
        schema: "public",
        table: "Evento",
      }, (payload) => {
        console.log("Deleted Evento: ", payload);
        setEventos((prevEventos) =>
          prevEventos.filter((evento) => evento.id !== payload.old.id)
        );
      })
      .subscribe();

    return () => {
      eventoChannel.unsubscribe();
    };
  }, []);

  const handleAddEvent = async () => {
    if (newEventName.trim() && !isLoading) {
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from("Evento")
          .insert({
            Nombre: newEventName.trim()
          })
          .select();

        if (error) {
          console.error("Error adding event:", error);
          alert(`Error: ${error.message}`);
        } else {
          console.log("Event added successfully:", data);
          setNewEventName(""); // Clear the input
          alert("Event agregado con éxito");
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        alert("Error al agregar evento");
      } finally {
        setIsLoading(false);
      }
    } else {
      alert("Please enter an event name.");
    }
  };

  return (
    <div className="">
      <div className="mb-6 p-4 rounded-lg">
        <h2 className="text-white text-xl font-bold mb-4">Evento Nuevo</h2>
        <div className="flex gap-4 items-center">
          <input
            type="text"
            value={newEventName}
            onChange={(e) => setNewEventName(e.target.value)}
            placeholder="Nombre del Evento"
            className="flex-1 px-3 py-2 border border-gray-300 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleAddEvent}
            disabled={!newEventName.trim()}
            className="px-6 py-2 bg-[#01d499] text-white rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Agregar Evento
          </button>
        </div>
      </div>

      {eventos.length === 0 ? (
      <p className="text-center text-white">No hay eventos</p>
    ) : (
      <ul className="flex flex-row flex-wrap justify-evenly content-evenly">
        {eventos.map((evento) => (
          <li className="mb-10" key={evento.id}>
            <EventCard name={evento.Nombre} id={evento.id} />
          </li>
        ))}
      </ul>
    )}
    
    </div>
  );
};

export default EventoList;
