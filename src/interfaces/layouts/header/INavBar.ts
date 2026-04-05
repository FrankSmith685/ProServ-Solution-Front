/* ---------------------------------- */
/* Page sections */
/* ---------------------------------- */

export type PageSection = "" | "services" | "about" | "contact";

/* ---------------------------------- */
/* Navigation item */
/* ---------------------------------- */

export interface NavItem {
  readonly label: string;
  readonly page: PageSection;
}

/* ---------------------------------- */
/* Navbar props */
/* ---------------------------------- */

export interface NavbarProps {
  initialMobileOpen?: boolean;
}

/* ---------------------------------- */
/* Shared props */
/* ---------------------------------- */

export interface ScrolledProps {
  scrolled: boolean;
}

/* ---------------------------------- */
/* NavLinks props */
/* ---------------------------------- */

export interface NavLinksProps extends ScrolledProps {
  items: readonly NavItem[];
}

/* ---------------------------------- */
/* MobileMenu props */
/* ---------------------------------- */

export interface MobileMenuProps {
  items: readonly NavItem[];
  onClose: () => void;
}