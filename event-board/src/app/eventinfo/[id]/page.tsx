/*
import { supabase } from "../../../lib/supabase";

async function fetchData() {
  const { data, error } = await supabase.from('Evento').select('*');
  if (error) {
    throw new Error('Error fetching data');
  }

  return data || [];  // Return empty array if data is undefined or null
};

export default async function EventInfo({
  params,
}: {
  params: Promise<{ id: string }>
}) {
    const { id } = await params
    const { events } = await fetchData;
    return (
      <div>{events}</div>
    )
}
    */


import EventoList from "../../../components/EventoList"; // Adjust the path if needed

const EventosPage = () => {
  return (
    <div>
      <EventoList />
    </div>
  );
};

export default EventosPage;