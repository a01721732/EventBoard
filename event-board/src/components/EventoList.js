"use client"; // Make sure to add this for client-side rendering

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase"; // Adjust the path if needed

const EventoList = () => {
  const [eventos, setEventos] = useState([]);

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

    // Create the subscription for real-time updates using the new API
    const eventoChannel = supabase
      .channel("evento-channel") // You can name the channel
      .on("postgres_changes", {
        event: "INSERT",        // Event type - INSERT, UPDATE, DELETE
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
      .subscribe(); // Always call subscribe to initiate the channel

    // Cleanup the subscription when the component unmounts
    return () => {
      eventoChannel.unsubscribe(); // Don't forget to unsubscribe when the component unmounts
    };
  }, []);

  return (
    <div>
      <h1>Eventos</h1>
      {eventos.length === 0 ? (
      <p>No eventos available</p> // Show message if there is no data
    ) : (
      <ul>
        {eventos.map((evento) => (
          <li key={evento.id}>
            {evento.Nombre}
          </li>
        ))}
      </ul>
    )}
    </div>
  );
};

export default EventoList;
