// Menu theme configurations
export const menuThemes: Record<string, {
  background: string
  text: string
  primary: string
  primaryHover: string
  secondary: string
  accent: string
  card: string
  cardHover: string
  border: string
  input: string
  inputBorder: string
  button: string
  buttonHover: string
  buttonText: string
  badge: string
  badgeText: string
  pattern: string
  modal: string
  modalBorder: string
}> = {
  default: {
    background: 'bg-white',
    text: 'text-gray-900',
    primary: 'bg-blue-600',
    primaryHover: 'hover:bg-blue-700',
    secondary: 'bg-blue-700',
    accent: 'text-blue-600',
    card: 'bg-white',
    cardHover: 'hover:bg-gray-50',
    border: 'border-gray-200',
    input: 'bg-white border-gray-300',
    inputBorder: 'focus:border-blue-500',
    button: 'bg-blue-600',
    buttonHover: 'hover:bg-blue-700',
    buttonText: 'text-white',
    badge: 'bg-blue-600',
    badgeText: 'text-white',
    pattern: 'rgb(156_163_175)',
    modal: 'bg-white',
    modalBorder: 'border-gray-200'
  },
  dark: {
    background: 'bg-gray-900',
    text: 'text-gray-100',
    primary: 'bg-yellow-500',
    primaryHover: 'hover:bg-yellow-600',
    secondary: 'bg-yellow-600',
    accent: 'text-yellow-400',
    card: 'bg-gray-800',
    cardHover: 'hover:bg-gray-750',
    border: 'border-gray-700',
    input: 'bg-gray-800 border-gray-600 text-gray-100',
    inputBorder: 'focus:border-yellow-500',
    button: 'bg-yellow-500',
    buttonHover: 'hover:bg-yellow-600',
    buttonText: 'text-gray-900',
    badge: 'bg-yellow-500',
    badgeText: 'text-gray-900',
    pattern: 'rgb(75_85_99)',
    modal: 'bg-gray-800',
    modalBorder: 'border-gray-700'
  },
  minimal: {
    background: 'bg-gray-50',
    text: 'text-gray-800',
    primary: 'bg-gray-600',
    primaryHover: 'hover:bg-gray-700',
    secondary: 'bg-gray-700',
    accent: 'text-gray-600',
    card: 'bg-white',
    cardHover: 'hover:bg-gray-50',
    border: 'border-gray-300',
    input: 'bg-white border-gray-300',
    inputBorder: 'focus:border-gray-500',
    button: 'bg-gray-600',
    buttonHover: 'hover:bg-gray-700',
    buttonText: 'text-white',
    badge: 'bg-gray-600',
    badgeText: 'text-white',
    pattern: 'rgb(209_213_219)',
    modal: 'bg-white',
    modalBorder: 'border-gray-300'
  },
  warm: {
    background: 'bg-amber-50',
    text: 'text-amber-900',
    primary: 'bg-amber-500',
    primaryHover: 'hover:bg-amber-600',
    secondary: 'bg-amber-600',
    accent: 'text-amber-600',
    card: 'bg-white',
    cardHover: 'hover:bg-amber-50',
    border: 'border-amber-200',
    input: 'bg-white border-amber-300',
    inputBorder: 'focus:border-amber-500',
    button: 'bg-amber-500',
    buttonHover: 'hover:bg-amber-600',
    buttonText: 'text-white',
    badge: 'bg-amber-500',
    badgeText: 'text-white',
    pattern: 'rgb(252_211_77)',
    modal: 'bg-white',
    modalBorder: 'border-amber-200'
  },
  cool: {
    background: 'bg-sky-50',
    text: 'text-sky-900',
    primary: 'bg-sky-500',
    primaryHover: 'hover:bg-sky-600',
    secondary: 'bg-sky-600',
    accent: 'text-sky-600',
    card: 'bg-white',
    cardHover: 'hover:bg-sky-50',
    border: 'border-sky-200',
    input: 'bg-white border-sky-300',
    inputBorder: 'focus:border-sky-500',
    button: 'bg-sky-500',
    buttonHover: 'hover:bg-sky-600',
    buttonText: 'text-white',
    badge: 'bg-sky-500',
    badgeText: 'text-white',
    pattern: 'rgb(125_211_252)',
    modal: 'bg-white',
    modalBorder: 'border-sky-200'
  },
  elegant: {
    background: 'bg-white',
    text: 'text-gray-900',
    primary: 'bg-black',
    primaryHover: 'hover:bg-gray-900',
    secondary: 'bg-gray-900',
    accent: 'text-yellow-600',
    card: 'bg-white',
    cardHover: 'hover:bg-gray-50',
    border: 'border-gray-300',
    input: 'bg-white border-gray-300',
    inputBorder: 'focus:border-black',
    button: 'bg-black',
    buttonHover: 'hover:bg-gray-900',
    buttonText: 'text-white',
    badge: 'bg-yellow-600',
    badgeText: 'text-white',
    pattern: 'rgb(209_213_219)',
    modal: 'bg-white',
    modalBorder: 'border-gray-300'
  },
  bold: {
    background: 'bg-red-50',
    text: 'text-red-900',
    primary: 'bg-red-500',
    primaryHover: 'hover:bg-red-600',
    secondary: 'bg-red-600',
    accent: 'text-red-600',
    card: 'bg-white',
    cardHover: 'hover:bg-red-50',
    border: 'border-red-200',
    input: 'bg-white border-red-300',
    inputBorder: 'focus:border-red-500',
    button: 'bg-red-500',
    buttonHover: 'hover:bg-red-600',
    buttonText: 'text-white',
    badge: 'bg-red-500',
    badgeText: 'text-white',
    pattern: 'rgb(248_113_113)',
    modal: 'bg-white',
    modalBorder: 'border-red-200'
  }
}

// Font configurations
export const menuFonts: Record<string, {
  name: string
  className: string
  cssVariable: string
  style?: React.CSSProperties
}> = {
  inter: {
    name: 'Inter',
    className: 'font-sans',
    cssVariable: 'var(--font-inter)',
    style: { fontFamily: 'var(--font-inter), sans-serif' }
  },
  roboto: {
    name: 'Roboto',
    className: 'font-sans',
    cssVariable: 'var(--font-roboto)',
    style: { fontFamily: 'var(--font-roboto), sans-serif' }
  },
  playfair: {
    name: 'Playfair Display',
    className: 'font-serif',
    cssVariable: 'var(--font-playfair)',
    style: { fontFamily: 'var(--font-playfair), serif' }
  },
  montserrat: {
    name: 'Montserrat',
    className: 'font-sans',
    cssVariable: 'var(--font-montserrat)',
    style: { fontFamily: 'var(--font-montserrat), sans-serif' }
  },
  lora: {
    name: 'Lora',
    className: 'font-serif',
    cssVariable: 'var(--font-lora)',
    style: { fontFamily: 'var(--font-lora), serif' }
  },
  opensans: {
    name: 'Open Sans',
    className: 'font-sans',
    cssVariable: 'var(--font-opensans)',
    style: { fontFamily: 'var(--font-opensans), sans-serif' }
  },
  raleway: {
    name: 'Raleway',
    className: 'font-sans',
    cssVariable: 'var(--font-raleway)',
    style: { fontFamily: 'var(--font-raleway), sans-serif' }
  },
  fredoka: {
    name: 'Fredoka One',
    className: 'font-sans',
    cssVariable: 'var(--font-fredoka)',
    style: { fontFamily: '"Fredoka One", sans-serif' }
  },
  comfortaa: {
    name: 'Comfortaa',
    className: 'font-sans',
    cssVariable: 'var(--font-comfortaa)',
    style: { fontFamily: 'var(--font-comfortaa), sans-serif' }
  },
  quicksand: {
    name: 'Quicksand',
    className: 'font-sans',
    cssVariable: 'var(--font-quicksand)',
    style: { fontFamily: 'var(--font-quicksand), sans-serif' }
  },
  nunito: {
    name: 'Nunito',
    className: 'font-sans',
    cssVariable: 'var(--font-nunito)',
    style: { fontFamily: 'var(--font-nunito), sans-serif' }
  },
  poppins: {
    name: 'Poppins',
    className: 'font-sans',
    cssVariable: 'var(--font-poppins)',
    style: { fontFamily: 'var(--font-poppins), sans-serif' }
  },
  dancingscript: {
    name: 'Dancing Script',
    className: 'font-serif',
    cssVariable: 'var(--font-dancingscript)',
    style: { fontFamily: 'var(--font-dancingscript), cursive' }
  },
  pacifico: {
    name: 'Pacifico',
    className: 'font-serif',
    cssVariable: 'var(--font-pacifico)',
    style: { fontFamily: 'var(--font-pacifico), cursive' }
  },
  caveat: {
    name: 'Caveat',
    className: 'font-serif',
    cssVariable: 'var(--font-caveat)',
    style: { fontFamily: 'var(--font-caveat), cursive' }
  },
  kalam: {
    name: 'Kalam',
    className: 'font-sans',
    cssVariable: 'var(--font-kalam)',
    style: { fontFamily: 'var(--font-kalam), sans-serif' }
  },
  permanentmarker: {
    name: 'Permanent Marker',
    className: 'font-sans',
    cssVariable: 'var(--font-permanentmarker)',
    style: { fontFamily: 'var(--font-permanentmarker), cursive' }
  }
}

