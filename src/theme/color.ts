export const getCSSVariable = (variable: string, defaultColor: string) => {
  if (typeof window === 'undefined') {
    return defaultColor;
  }
  return getComputedStyle(document.documentElement).getPropertyValue(variable);
};

export interface IColorBase {
  primary: string;
  secondary: string;
  white: string;
  blackOrigin: string;
  transparent: string;
  background: {
    primary: string;
    secondary: string;
    purple: string;
  };
  disable: string;
  red: {
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
  };
  green: {
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    userIcon: string;
  };
  blue: {
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    blueBlack: string;
    blueDark: string;
  };
  yellow: {
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    pineapple: string;
  };
  orange: {
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
  };
  teal: {
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
  };
  purple: {
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
  };
  magenta: {
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
  };
  black: {
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
  };
  gray: string;
  brown: {
    200: string;
  };
  chart: {
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    1000: string;
    1100: string;
    1200: string;
    1300: string;
    1400: string;
    1500: string;
    1600: string;
    1700: string;
    1800: string;
    1900: string;
  };
}

const color: IColorBase = {
  get primary() {
    return getCSSVariable('--primary', '#8951ff');
  },
  get secondary() {
    return getCSSVariable('--secondary', '#977DFF');
  },
  get white() {
    return getCSSVariable('--white', '#FFFFFF');
  },
  get blackOrigin() {
    return getCSSVariable('--black-origin', '#000');
  },
  get transparent() {
    return getCSSVariable('--transparent', 'transparent');
  },
  background: {
    get primary() {
      return getCSSVariable('--background-primary', '#F7F7F7');
    },
    get secondary() {
      return getCSSVariable('--background-secondary', '#F8F8FF');
    },
    get purple() {
      return getCSSVariable('--background-purple', '#E7DCFF');
    },
  },
  get disable() {
    return getCSSVariable('--disable', '#B5B5B5');
  },
  red: {
    get 100() {
      return getCSSVariable('--red-100', '#FFE5E5');
    },
    get 200() {
      return getCSSVariable('--red-200', '#FF8080');
    },
    get 300() {
      return getCSSVariable('--red-300', '#FF5C5C');
    },
    get 400() {
      return getCSSVariable('--red-400', '#FF3B3B');
    },
    get 500() {
      return getCSSVariable('--red-500', '#E53535');
    },
  },
  green: {
    get 100() {
      return getCSSVariable('--green-100', '#E3FFF1');
    },
    get 200() {
      return getCSSVariable('--green-200', '#56EBA1');
    },
    get 300() {
      return getCSSVariable('--green-300', '#39D98A');
    },
    get 400() {
      return getCSSVariable('--green-400', '#06C270');
    },
    get 500() {
      return getCSSVariable('--green-500', '#05A660');
    },
    get userIcon() {
      return getCSSVariable('--green-user-icon', '#1FAF38');
    },
  },
  blue: {
    get 100() {
      return getCSSVariable('--blue-100', '#E3EEFF');
    },
    get 200() {
      return getCSSVariable('--blue-200', '#A8C8FE');
    },
    get 300() {
      return getCSSVariable('--blue-300', '#6396FE');
    },
    get 400() {
      return getCSSVariable('--blue-400', '#3E7BFA');
    },
    get 500() {
      return getCSSVariable('--blue-500', '#2268FA');
    },
    get blueBlack() {
      return getCSSVariable('--blue-black', '#1C1C28');
    },
    get blueDark() {
      return getCSSVariable('--blue-dark', '#10004B');
    },
  },
  yellow: {
    get 100() {
      return getCSSVariable('--yellow-100', '#FFFEE5');
    },
    get 200() {
      return getCSSVariable('--yellow-200', '#FDED72');
    },
    get 300() {
      return getCSSVariable('--yellow-300', '#FDDD48');
    },
    get 400() {
      return getCSSVariable('--yellow-400', '#FFCC00');
    },
    get 500() {
      return getCSSVariable('--yellow-500', '#E5B800');
    },
    get 600() {
      return getCSSVariable('--yellow-600', '#E57A00');
    },
    get pineapple() {
      return getCSSVariable('--yellow-pineapple', '#F4BF00');
    },
  },
  orange: {
    get 100() {
      return getCSSVariable('--orange-100', '#FFF8E5');
    },
    get 200() {
      return getCSSVariable('--orange-200', '#FCCC75');
    },
    get 300() {
      return getCSSVariable('--orange-300', '#FDAC42');
    },
    get 400() {
      return getCSSVariable('--orange-400', '#FF8800');
    },
    get 500() {
      return getCSSVariable('--orange-500', '#E57A00');
    },
  },
  teal: {
    get 100() {
      return getCSSVariable('--teal-100', '#E5FFFF');
    },
    get 200() {
      return getCSSVariable('--teal-200', '#A9EFF2');
    },
    get 300() {
      return getCSSVariable('--teal-300', '#73DFE7');
    },
    get 400() {
      return getCSSVariable('--teal-400', '#00CFDE');
    },
    get 500() {
      return getCSSVariable('--teal-500', '#00B7C4');
    },
  },
  purple: {
    get 100() {
      return getCSSVariable('--purple-100', '#EFEFFF');
    },
    get 200() {
      return getCSSVariable('--purple-200', '#D5D5FF');
    },
    get 300() {
      return getCSSVariable('--purple-300', '#BDBEFF');
    },
    get 400() {
      return getCSSVariable('--purple-400', '#9697FF');
    },
    get 500() {
      return getCSSVariable('--purple-500', '#7274FF');
    },
  },
  magenta: {
    get 100() {
      return getCSSVariable('--magenta-100', '#FFF0F6');
    },
    get 200() {
      return getCSSVariable('--magenta-200', '#FFADD2');
    },
    get 300() {
      return getCSSVariable('--magenta-300', '#FF85C0');
    },
    get 400() {
      return getCSSVariable('--magenta-400', '#F759AB');
    },
    get 500() {
      return getCSSVariable('--magenta-500', '#EB2F96');
    },
  },
  black: {
    get 100() {
      return getCSSVariable('--black-100', '#1C1C28');
    },
    get 200() {
      return getCSSVariable('--black-200', '#3E3E3E');
    },
    get 300() {
      return getCSSVariable('--black-300', '#636363');
    },
    get 400() {
      return getCSSVariable('--black-400', '#8F90A6');
    },
    get 500() {
      return getCSSVariable('--black-500', '#C7C9D9');
    },
    get 600() {
      return getCSSVariable('--black-600', '#E8E9EE');
    },
    get 700() {
      return getCSSVariable('--black-700', '#F1F2F5');
    },
  },
  get gray() {
    return getCSSVariable('--gray', '#333333');
  },
  brown: {
    get 200() {
      return getCSSVariable('--brown-200', '#853800');
    },
  },
  chart: {
    get 100() {
      return getCSSVariable('--chart-100', '#977DFF');
    },
    get 200() {
      return getCSSVariable('--chart-200', '#FDDD48');
    },
    get 300() {
      return getCSSVariable('--chart-300', '#06C270');
    },
    get 400() {
      return getCSSVariable('--chart-400', '#FF85C0');
    },
    get 500() {
      return getCSSVariable('--chart-500', '#6396FE');
    },
    get 600() {
      return getCSSVariable('--chart-600', '#00CFDE');
    },
    get 700() {
      return getCSSVariable('--chart-700', '#8F90A6');
    },
    get 800() {
      return getCSSVariable('--chart-800', '#BDBEFF');
    },
    get 900() {
      return getCSSVariable('--chart-900', '#FDED72');
    },
    get 1000() {
      return getCSSVariable('--chart-1000', '#39D98A');
    },
    get 1100() {
      return getCSSVariable('--chart-1100', '#FFADD2');
    },
    get 1200() {
      return getCSSVariable('--chart-1200', '#A8C8FE');
    },
    get 1300() {
      return getCSSVariable('--chart-1300', '#73DFE7');
    },
    get 1400() {
      return getCSSVariable('--chart-1400', '#C7C9D9');
    },
    get 1500() {
      return getCSSVariable('--chart-1500', '#D5D5FF');
    },
    get 1600() {
      return getCSSVariable('--chart-1600', '#FFF8BE');
    },
    get 1700() {
      return getCSSVariable('--chart-1700', '#56EBA1');
    },
    get 1800() {
      return getCSSVariable('--chart-1800', '#E3EEFF');
    },
    get 1900() {
      return getCSSVariable('--chart-1900', '#A9EFF2');
    },
  },
};

export const CHART_COLOR_PALETTE = [
  color.chart[100],
  color.chart[200],
  color.chart[300],
  color.chart[400],
  color.chart[500],
  color.chart[600],
  color.chart[700],
  color.chart[800],
  color.chart[900],
  color.chart[1000],
  color.chart[1100],
  color.chart[1200],
  color.chart[1300],
  color.chart[1400],
  color.chart[1500],
  color.chart[1600],
  color.chart[1700],
  color.chart[1800],
  color.chart[1900],
];

export default color;
