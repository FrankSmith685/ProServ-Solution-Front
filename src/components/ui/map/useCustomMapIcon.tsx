// import { useMemo } from "react";
// import L from "leaflet";
// import { FaSpinner } from "react-icons/fa";
// import ReactDOMServer from "react-dom/server";
// import { useImagePreloader } from "@/hooks/useImageHooks/useImagePreloader";
// import type { CustomMapIconProps } from "@/interfaces/ui/map/ICustomMapIcon";

// export const useCustomMapIcon = ({
//   name,
//   size = [40, 40],
//   anchor,
//   alt = "custom-pin",
// }: CustomMapIconProps): L.Icon | L.DivIcon => {
//   const { images, isLoaded } = useImagePreloader();
//   const imageSrc = images[name];

//   return useMemo(() => {
//     if (isLoaded && imageSrc) {
//       return L.icon({
//         iconUrl: imageSrc,
//         iconSize: size,
//         iconAnchor: anchor ?? [size[0] / 2, size[1]],
//       });
//     }

//     return L.divIcon({
//       html: ReactDOMServer.renderToString(
//         <div
//           aria-label={alt}
//           style={{
//             width: `${size[0]}px`,
//             height: `${size[1]}px`,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//         >
//           <FaSpinner className="animate-spin text-primary text-xl" />
//         </div>
//       ),
//       iconSize: size,
//       iconAnchor: anchor ?? [size[0] / 2, size[1]],
//     });
//   }, [isLoaded, imageSrc, size, anchor, alt]);
// };
