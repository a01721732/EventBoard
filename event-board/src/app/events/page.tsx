import EventoList from "../../components/EventoList";

const EventosPage = () => {
  return (
    <div className="pt-30 bg-[#444444] min-h-screen">
      <h1 className="text-white text-center text-5xl mb-10">Eventos</h1>
      <EventoList />
    </div>
  );
};

export default EventosPage;