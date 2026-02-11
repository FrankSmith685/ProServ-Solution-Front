// import { useHuarique } from "@/hooks/panel/mis-huariques/useHuariques";

export const HuariquePublicacionPage = () => {
  // const { huarique, isPublishable, publishHuarique } = useHuarique();

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Publicación</h1>

      <ul className="list-disc ml-5 text-sm">
        <li>Información completa</li>
        <li>Imagen principal</li>
        <li>Al menos un plato</li>
      </ul>

      {/* <button
        disabled={!isPublishable}
        onClick={publishHuarique}
        className="btn-primary"
      >
        Publicar Huarique
      </button>

      {huarique?.status === "published" && (
        <a
          href={`/huarique/${huarique.id}`}
          target="_blank"
          className="text-primary underline text-sm"
        >
          Ver huarique publicado
        </a>
      )} */}
    </div>
  );
};
