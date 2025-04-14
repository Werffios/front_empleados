// app/page.tsx
export default function Home() {
  return (
    <div className="py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Sistema de Gestión Empresarial</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Gestione empleados y solicitudes de forma sencilla y eficiente
        </p>
      </div>


      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6 max-w-4xl mx-auto">
        <p className="text-gray-600">
          Apasionado por el desarrollo, me llamo Nicolas Suarez 😎. Trabajo eficazmente con TypeScript, Angular, React, .NET, FastAPI, Django y otras tecnologías. Poseo habilidades en Programación de Software (Python, Java y C++), Desarrollo Web (TailwindCSS, AlpineJS, Laravel, Livewire, Node.js), Ciencia de Datos con Python, Gestión de Bases de Datos (MySQL, PostgreSQL, SQLServer), Linux (Ubuntu, Wifislax), Git (Git, GitHub, GitLab) y Redes (Cisco, Packet Tracer, GNS3). 🚀👍
        </p>
      </div>
    </div>
  );
}