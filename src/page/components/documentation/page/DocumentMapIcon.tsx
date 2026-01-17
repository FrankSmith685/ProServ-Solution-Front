// import { useState, type FC } from "react";
// import type { PropItem } from "@/interfaces/documents/IDocumentComponents";
// import { DocumentComponent } from "../components/DocumentComponent";
// import { CustomSelected } from "@/components/ui/kit/CustomSelected";
// import { CustomInput } from "@/components/ui/kit/CustomInput";
// import { CustomSwitch } from "@/components/ui/kit/CustomSwitch";
// import { useCustomMapIcon } from "@/hooks/map/useCustomMapIcon";

// const DocumentCustomMapIcon: FC = () => {
//   const [name, setName] = useState("pin-default");
//   const [width, setWidth] = useState(40);
//   const [height, setHeight] = useState(40);
//   const [anchorX, setAnchorX] = useState(20);
//   const [anchorY, setAnchorY] = useState(40);

//   const icon = useCustomMapIcon({
//     name,
//     size: [width, height],
//     anchor: [anchorX, anchorY],
//     alt: "map-icon",
//   });

//   const props: PropItem[] = [
//     { name: "name", description: "Nombre del recurso de imagen", type: "string", defaultValue: `"pin-default"`, required: true },
//     { name: "size", description: "Tamaño del icono", type: "[number, number]", defaultValue: "[40, 40]" },
//     { name: "anchor", description: "Punto de anclaje", type: "[number, number]", defaultValue: "[20, 40]" },
//     { name: "alt", description: "Texto accesible", type: "string", defaultValue: `"custom-pin"` },
//   ];

//   return (
//     <DocumentComponent
//       name="Custom Map Icon"
//       description="Hook reutilizable para generar íconos de Leaflet con imagen o fallback con spinner."
//       props={props}
//       controls={
//         <div className="rounded-2xl border border-white/60 bg-linear-to-br from-white/95 to-primary/5 backdrop-blur p-6 shadow-[0_10px_30px_rgba(0,0,0,.06)]">
//           <p className="text-xs font-bold text-gray-500 mb-3">
//             Controles
//           </p>

//           <div className="flex flex-col gap-4">
//             <CustomSelected
//               label="Icon name"
//               value={name}
//               onChange={(e) => setName(String(e.target.value))}
//               options={[
//                 { value: "pin-default", label: "Default" },
//                 { value: "pin-store", label: "Store" },
//                 { value: "pin-user", label: "User" },
//               ]}
//               fullWidth
//             />

//             <div className="grid grid-cols-2 gap-4">
//               <CustomInput
//                 label="Width"
//                 type="number"
//                 value={String(width)}
//                 onChange={(e) => setWidth(Number(e.target.value))}
//                 fullWidth
//               />
//               <CustomInput
//                 label="Height"
//                 type="number"
//                 value={String(height)}
//                 onChange={(e) => setHeight(Number(e.target.value))}
//                 fullWidth
//               />
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <CustomInput
//                 label="Anchor X"
//                 type="number"
//                 value={String(anchorX)}
//                 onChange={(e) => setAnchorX(Number(e.target.value))}
//                 fullWidth
//               />
//               <CustomInput
//                 label="Anchor Y"
//                 type="number"
//                 value={String(anchorY)}
//                 onChange={(e) => setAnchorY(Number(e.target.value))}
//                 fullWidth
//               />
//             </div>
//           </div>
//         </div>
//       }
//       preview={
//         <div className="p-6 rounded-xl border bg-white shadow-sm text-sm">
//           Este hook retorna:
//           <pre className="mt-3 text-xs bg-gray-900 text-white p-3 rounded-lg overflow-auto">
//             {JSON.stringify(icon, null, 2)}
//           </pre>
//         </div>
//       }
//     />
//   );
// };

// export default DocumentCustomMapIcon;
