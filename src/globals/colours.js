//global colours
const mainColours = {
  primaryColor: '#0195DA',
  secondaryColor: '#EBF1F4',

  primaryPink: '#FF326D',
  lightPink: '#EDE9EF',

  primaryOrange: '#F1A035',
  lightOrange: '#f0b15d',
  lowOrange: '#fadfbb',


  primaryBlue:'#162974',
  lightBlue:'#5b7fba',
  lowBlue:'#E8EEFF',
  darkBlue:'#1B243D',


  primaryWhite: '#ffffff',
  lightWhite: '#e3e3e3',
  lowWhite: '#faf7f7',

  primaryBlack: '#151515',
  primaryGrey: '#70726F',
  lightGrey: '#adadad',
  lowGrey: '#DADFEC',

  primaryYellow: '#fdcf09',

  primaryGreen: '#44B74B',
  lightGreen: '#83de88',
  lowGreen: '#c6f7c9',
  
  primaryRed: "#D71920",
  // lightRed: '#11b08e',
  lightRed: '#F97C80',
  lowRed: '#FBE0E1',
  // lowRed: '#bfe0c0',


  darkBlack:'#313131',
  yellow:'#F5DB0A',
  blue:'#38A2DA',
  gray:'#8C9199',
  textGray:'#919191',
  backgroundColor:'#ebf1f4',
  secondaryBlue:'#4287f5'

  
};
const colours = {
  ...mainColours,
  authScreens: {
    background: mainColours.whiteBackground,
    text: mainColours.secondaryColor,
    primaryBtn: mainColours.primaryColor,
    secondaryBtn: mainColours.secondaryColor,
  },
};

export default colours;
