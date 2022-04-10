module.exports = {
  purge: ['./src/{pages,components}/**/*.{jsx,tsx}'],
  theme: {
    extend: {
      backgroundColor: {
        'light-blue': '#6BDAD5',
        'light-turquoise': 'rgba(48, 221, 214, 0.15)',
      },
      borderRadius: {
        xl: '10px',
      },
      colors: {
        'light-blue': '#6BDAD5',
        turquoise: '#30d2dd',
      },
      fontFamily: {
        muliBold: 'Muli-ExtraBold',
      },
      fontSize: {
        xxs: '.65rem',
      },
      height: {
        '1/5': '20%',
        '4/5': '80%',
        modal: '45%',
      },
      letterSpacing: {
        beyond: '1.2px',
      },
      maxHeight: {
        autocomplete: '130px',
        'process-mobile': '325px',
        'process-desktop': '275px',
      },
      maxWidth: {
        '9/10': '90%',
        '1/2': '50%',
        btn: '264px',
      },
      minHeight: {
        modal: '430px',
      },
      minWidth: {
        btn: '170px',
      },
      transitionProperty: {
        'font-size': 'font-size',
      },
      width: {
        autocomplete: '19rem',
      },
      zIndex: {
        max: 9999999,
      },
    },
  },
};
