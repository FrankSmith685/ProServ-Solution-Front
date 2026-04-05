// documentation/index.ts
import type { Item } from "@/interfaces/ui/layout/IComponentSidebar";
import DocumentSwitch from "./page/DocumentSwitch";
import DocumentSelected from "./page/DocumentSelected";
import DocumentInput from "./page/DocumentInput";
import DocumentPassword from "./page/DocumentPassword";
import DocumentSearch from "./page/DocumentSearch";
import DocumentButton from "./page/DocumentButton";
// import DocumentAlert from "./page/DocumentAlert";
// import DocumentCard from "./page/DocumentCard";
// import DocumentCheckbox from "./page/DocumentCheckbox";
// import DocumentChip from "./page/DocumentChip";
// import DocumentLink from "./page/DocumentLink";
// import DocumentTable from "./page/DocumentTable";
// import DocumentSidebarItem from "./page/DocumentSidebarItem";
// import DocumentSectionLayout from "./page/DocumentSectionLayout";
// import DocumentImageViewer from "./page/DocumentIImageViewer";
// import DocumentModal from "./page/DocumentModal";
// import DocumentModalConfirm from "./page/DocumentModalConfirm";
// import DocumentSidebarMenu from "./page/DocumentSidebarMenu";
// import DocumentSidebarSubMenu from "./page/DocumentSidebarSubMenu";
// import DocumentStepProgressBar from "./page/DocumentStepProgressBar";
// import DocumentCustomImage from "./page/DocumentImage";
// import DocumentLogo from "./page/DocumentLogo";
// import DocumentNotification from "./page/DocumentNotification";
// import DocumentUserTypeModal from "./page/DocumentUserTypeModal";
// import DocumentColors from "./components/DocumentColors";

export const catalog: Item[]  = [
  { id: "switch", label: "Switch", type: "component", Component: DocumentSwitch },
  { id: "selected", label: "Selected",type: "component" ,Component: DocumentSelected },
  { id: "input", label: "Input", type: "component" ,Component: DocumentInput },
  { id: "password", label: "Password",type: "component", Component: DocumentPassword },
  { id: "search", label: "Search",type: "component", Component: DocumentSearch },
  { id: "button", label: "Button",type: "component", Component: DocumentButton },
  // { id: "alert", label: "Alert",type: "component", Component: DocumentAlert },
  // { id: "card", label: "Card",type: "component", Component: DocumentCard },
  // { id: "checkbox", label: "CheckBox",type: "component", Component: DocumentCheckbox },
  // { id: "chip", label: "Chip",type: "component", Component: DocumentChip },
  // { id: "link", label: "Link",type: "component", Component: DocumentLink },
  // { id: "table", label: "Table",type: "component", Component: DocumentTable },
  // { id: "item-sidebar", label: "Item Sidebar",type: "component", Component: DocumentSidebarItem },
  // { id: "section-layout", label: "Section Layout",type: "component", Component: DocumentSectionLayout },
  // { id: "image", label: "Image",type: "component", Component: DocumentCustomImage },
  // // { id: "section-layout", label: "Section Layout",type: "component", Component: DocumentMap },
  // { id: "image-viewer", label: "Image Viewer",type: "component", Component: DocumentImageViewer },
  // { id: "logo", label: "Logo",type: "component", Component: DocumentLogo },
  // { id: "modal", label: "Modal",type: "component", Component: DocumentModal },
  // { id: "modal-confirm", label: "Modal Confirm",type: "component", Component: DocumentModalConfirm },
  // { id: "notification", label: "Notification",type: "component", Component: DocumentNotification },
  // { id: "sidebar-menu", label: "Sidebar Menu",type: "component", Component: DocumentSidebarMenu },
  // { id: "sidebar-sub-menu", label: "Sidebar Sub Menu",type: "component", Component: DocumentSidebarSubMenu },
  // { id: "step-progress-bar", label: "Step Progress Bar",type: "component", Component: DocumentStepProgressBar },
  // { id: "user-type-modal", label: "User Type Modal",type: "component", Component: DocumentUserTypeModal },

  // { id: "colors", label: "Colors", type: "style", Component: DocumentColors },

];
