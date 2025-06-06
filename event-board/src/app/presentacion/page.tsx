

const EventInfoPage = () => {
  return (
    <div className="bg-[#444444] pt-30 min-h-screen text-center">
      <h2 className="text-4xl z-11 text-white mb-5">Funcionalidades</h2>
      <ul className="text-white">
        <li>Creación de Eventos</li>
        <li>Registro de Participantes</li>
        <li>Validación de Valores Repetidos (por nombre)</li>
        <li>Responsividad</li>
        <li>Conexión mediante API a base de datos relacional (PostgreSQL)</li>
      </ul>
    </div>
  );
};

export default EventInfoPage;