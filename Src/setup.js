import React, {useEffect, useState, createContext, useRef} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {View} from 'react-native';
import moment from 'moment';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import RootNavigation from './Navigation/RootNavigation';
import { APITokenCall } from './http_config/axios_config';
export const app_context = createContext();
export const user_context = createContext();
export const water_context = createContext();
export const foodLog_context = createContext();


const Root = (props) => {
  const [date, setDate] = useState('');
  const [DisplayDate, setDisplayText] = useState('');
  const [waterTracker, setWaterT] = useState('')
  const [waterText, setWaterText] = useState('Drink Water');
  const [APIT,setAPIT] = useState('');

  


  useEffect(async ()=>{
    //eventually to improve throughput we will eventually store and check if its valid or not then take action
    let response = await APITokenCall.get('getFoodAccessToken');
    setAPIT(response.data.access_token);
  },[])

  updateWaterTracker = () =>{
    const dateTime = moment.now();
    const dateTimeText = moment(dateTime).format('h:mm a')
    setWaterT(dateTime);
    setWaterText(dateTimeText);
    }
   
  
  

  incrementDate = () => {
    let newDate = moment(date).add(1, 'days');
    let newDisplayDate = moment(newDate).format('MMMM Do, YYYY');
    setDate(newDate);
    setDisplayText(newDisplayDate);
 }
 decrementDate = () => {
  let newDate = moment(date).subtract(1, 'days');
  let newDisplayDate = moment(newDate).format('MMMM Do, YYYY');
  setDate(newDate);
  setDisplayText(newDisplayDate);
}
editDate = (arg) =>{
  const dateString = arg.dateString;
  const date = moment(dateString).format();
  const DisplayDate = moment(date).format('MMMM Do, YYYY');
  setDate(date);
  setDisplayText(DisplayDate);
  
}
  const BFLogRef = useRef([{name: 'add', id: Math.random() % 5000}]);
  const LunchLogRef = useRef([
    {
      name: 'add',
      id: Math.random() % 5000,
    },
  ]);
  const DinnerLogRef = useRef([
    {
      name: 'add',
      id: Math.random() % 5000,
    },
  ]);
  const SnackLogRef = useRef([
    {
      name: 'add',
      id: Math.random() % 5000,
    },
  ]);

  const [ThemeStyle, setThemeStyle] = useState('dark');
  const [User, setUserInfo] = useState({
    name: '',
    age: 0,
    weight: 0,
    gender: '',
    username: 'Oscarmmgg',
  });
  const [graphData, setGraphData] = useState({
    graphLabels: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    graphDataP: [80, 20, 30, 45, 50, 60, 70],
  });
  const [userGoals, setUserGoals] = useState({
    proteinGoal: 100,
    fatGoal: 100,
    carbGoal: 100,
    proteinCurrent: 0,
    fatCurrent: 0,
    carbCurrent: 0,
  });
  const [waterGoals, setWaterGoals] = useState({
    waterGoal: 15,
    waterCurrent: 0,
  });
  const [missGoals, setMissGoals] = useState({
    sodiumCurrent: 0,
    sugarCurrent: 0,
    sodiumGoal: 0,
    sugarGoal: 0,
  });


  const [macroData, setMacroData] = useState({
    data: [
      {
        name: 'Protein',
        macroGoal: userGoals.proteinGoal,
        macroCurrent: userGoals.proteinCurrent,
        colorStart: '#fb8be3',
        colorMiddle: '#fa7be8',
        colorEnd: '#ff67ea',
      },
      {
        name: 'Fat',
        macroGoal: userGoals.fatGoal,
        macroCurrent: userGoals.fatCurrent,
        colorStart: '#fada7a',
        colorMiddle: '#ffd968',
        colorEnd: '#ffd454',
      },
      {
        name: 'Carbohydrates',
        macroGoal: userGoals.carbGoal,
        macroCurrent: userGoals.carbCurrent,
        colorStart: '#6ae7bd',
        colorMiddle: '#5beebc',
        colorEnd: '#49ffc2',
      },
      {
        name: 'Sugar',
        macroGoal: missGoals.sugarGoal,
        macroCurrent: missGoals.sugarCurrent,
        colorStart: '#74abdf',
        colorMiddle: '#6aaeee',
        colorEnd: '#4fa0ed',
      },
      {
        name: 'Sodium',
        macroGoal: missGoals.sodiumGoal,
        macroCurrent: missGoals.sodiumCurrent,
        colorStart: '#a064e0',
        colorMiddle: '#9754de',
        colorEnd: '#9046df',
      },
    ],
  });

  const [imagePath, setImagePath] = useState('');
  
  async function getData(key){
    let response = await AsyncStorage.getItem(key);
    return response;
  }

  React.useEffect(async ()=>{if(imagePath === ''){
    const response = await getData('@userImageURI')
    const now = moment.now();
    const cDate = moment(now).format('MMMM Do, YYYY')
    setImagePath(response)
    setDate(now);
    setDisplayText(cDate);
    
  }})

  const [AuthStatus, setAuthStatus] = useState('1');

  function setLogQuantity(object, value) {
    console.log(`entry: will now begin to setValue with value ${value}`);
    switch (object.logGroup) {
      case 'BF': {
        let temp = BFLogRef.current.map((obj) =>
          object.id === obj.id ? {...obj, quantity: value} : obj,
        );
        BFLogRef.current = temp;
        update();

        break;
      }
      case 'LN': {
        let temp = LunchLogRef.current.map((obj) =>
          object.id === obj.id ? {...obj, quantity: value} : obj,
        );
        LunchLogRef.current = temp;
        update();
      }
      case 'DN': {
        let temp = DinnerLogRef.current.map((obj) =>
          object.id === obj.id ? {...obj, quantity: value} : obj,
        );
        DinnerLogRef.current = temp;
        update();
      }
      case 'SN': {
        let temp = SnackLogRef.current.map((obj) =>
          object.id === obj.id ? {...obj, quantity: value} : obj,
        );
        SnackLogRef.current = temp;
        update();
      }
    }
  }

  function update() {
    let pc = 0;
    let fc = 0;
    let cc = 0;
    let sc = 0;
    let soc = 0;
    BFLogRef.current.map((obj, index) => {
      if (index > 0) {
        pc += obj.protein * parseFloat(obj.quantity);
        fc += obj.fat * parseFloat(obj.quantity);
        cc += obj.carbohydrate * parseFloat(obj.quantity);
        sc += obj.sugar * parseFloat(obj.quantity);
        soc += obj.sodium * parseFloat(obj.quantity);
      }
    });
    LunchLogRef.current.map((obj, index) => {
      if (index > 0) {
        pc += obj.protein * obj.quantity;
        fc += obj.fat * obj.quantity;
        cc += obj.carbohydrate * obj.quantity;
        sc += obj.sugar * obj.quantity;
        soc += obj.sodium * obj.quantity;
      }
    });
    DinnerLogRef.current.map((obj, index) => {
      if (index > 0) {
        pc += obj.protein * parseFloat(obj.quantity);
        fc += obj.fat * parseFloat(obj.quantity);
        cc += obj.carbohydrate * parseFloat(obj.quantity);
        sc += obj.sugar * parseFloat(obj.quantity);
        soc += obj.sodium * parseFloat(obj.quantity);
      }
    });
    SnackLogRef.current.map((obj, index) => {
      if (index > 0) {
        pc += obj.protein * parseFloat(obj.quantity);
        fc += obj.fat * parseFloat(obj.quantity);
        cc += obj.carbohydrate * parseFloat(obj.quantity);
        sc += obj.sugar * parseFloat(obj.quantity);
        soc += obj.sodium * parseFloat(obj.quantity);
      }
    });
    setGoals(pc, fc, cc, sc, soc);
  }

  function editBFLogData(value) {
    
    
    let newEntry = {
      name: value.food_name,
      id: Math.random(),
      protein: parseFloat(value.protein),
      fat: parseFloat(value.fat),
      carbohydrate: parseFloat(value.carbohydrates),
      sugar: parseFloat(value.sugar),
      sodium: parseFloat(value.sodium),
      servingDescription: value.serving_description,
      quantity: '1',
      logGroup: 'BF',
    };
    let size = 0;
    BFLogRef.current.map((obj) => {
      size += 1;
    });
    BFLogRef.current[size] = newEntry;
    update();
  }
  function removeBFLogData(value) {
    let temp = BFLogRef.current.filter((obj) => value.id != obj.id);
    BFLogRef.current = temp;
    update();
  }
  function editLunchLogData(value) {
    let newEntry = {
      name: value.food_name,
      id: Math.random(),
      protein: parseFloat(value.protein),
      fat: parseFloat(value.fat),
      carbohydrate: parseFloat(value.carbohydrates),
      sugar: parseFloat(value.sugar),
      sodium: parseFloat(value.sodium),
      servingDescription: value.serving_description,
      quantity: '1',
      logGroup: 'LN',
    };
    let size = 0;
    LunchLogRef.current.map((obj) => {
      size += 1;
    });
    LunchLogRef.current[size] = newEntry;
    update();
  }
  function removeLunchLogData(value) {
    let temp = LunchLogRef.current.filter((obj) => value.id != obj.id);
    LunchLogRef.current = temp;
    update();
  }
  function editDinnerLogData(value) {
    let newEntry = {
      name: value.food_name,
      id: Math.random(),
      protein: parseFloat(value.protein),
      fat: parseFloat(value.fat),
      carbohydrate: parseFloat(value.carbohydrates),
      sugar: parseFloat(value.sugar),
      sodium: parseFloat(value.sodium),
      servingDescription: value.serving_description,
      quantity: '1',
      logGroup: 'DN',
    };
    let size = 0;
    DinnerLogRef.current.map((obj) => {
      size += 1;
    });
    DinnerLogRef.current[size] = newEntry;
    update();
  }
  function removeDinnerLogData(value) {
    let temp = DinnerLogRef.current.filter((obj) => value.id != obj.id);
    DinnerLogRef.current = temp;
    update();
  }
  function editSnackLogData(value) {
    let newEntry = {
      name: value.food_name,
      id: Math.random(),
      protein: parseFloat(value.protein),
      fat: parseFloat(value.fat),
      carbohydrate: parseFloat(value.carbohydrates),
      sugar: parseFloat(value.sugar),
      sodium: parseFloat(value.sodium),
      servingDescription: value.serving_description,
      quantity: '1',
      logGroup: 'SN',
    };
    let size = 0;
    SnackLogRef.current.map((obj) => {
      size += 1;
    });
    SnackLogRef.current[size] = newEntry;
    update();
  }
  function removeSnackLogData(value) {
    let temp = SnackLogRef.current.filter((obj) => value.id != obj.id);
    SnackLogRef.current = temp;
    update();
  }
  function setWaterGoal(val) {
    let oldCurrent = waterGoals.waterCurrent;
    setWaterGoals({waterGoal: val, waterCurrent: oldCurrent});
  }
  function increaseWaterLevel() {
    let oldGoal = waterGoals.waterGoal;
    let oldCurrent = waterGoals.waterCurrent;
    if (oldCurrent < oldGoal) {
      setWaterGoals({waterGoal: oldGoal, waterCurrent: oldCurrent + 1});
    }
  }
  function decreaseWaterLevel() {
    let oldGoal = waterGoals.waterGoal;
    let oldCurrent = waterGoals.waterCurrent;
    if (oldCurrent > 0) {
      setWaterGoals({waterGoal: oldGoal, waterCurrent: oldCurrent - 1});
    }
  }

  useEffect(() => {
    setMacroData({
      data: [
        {
          name: 'Protein',
          macroGoal: userGoals.proteinGoal,
          macroCurrent: userGoals.proteinCurrent,
          colorStart: '#fb8be3',
          colorMiddle: '#fa7be8',
          colorEnd: '#ff67ea',
        },
        {
          name: 'Fat',
          macroGoal: userGoals.fatGoal,
          macroCurrent: userGoals.fatCurrent,
          colorStart: '#fada7a',
          colorMiddle: '#ffd968',
          colorEnd: '#ffd454',
        },
        {
          name: 'Carbohydrates',
          macroGoal: userGoals.carbGoal,
          macroCurrent: userGoals.carbCurrent,
          colorStart: '#6ae7bd',
          colorMiddle: '#5beebc',
          colorEnd: '#49ffc2',
        },
        {
          name: 'Sugar',
          macroGoal: missGoals.sugarGoal,
          macroCurrent: missGoals.sugarCurrent,
          colorStart: '#74abdf',
          colorMiddle: '#6aaeee',
          colorEnd: '#4fa0ed',
        },
        {
          name: 'Sodium',
          macroGoal: missGoals.sodiumGoal,
          macroCurrent: missGoals.sodiumCurrent,
          colorStart: '#a064e0',
          colorMiddle: '#9754de',
          colorEnd: '#9046df',
        },
      ],
    });
  }, [userGoals]);

  function setGoalsR(val, val2, val3, val4, val5) {
    setUserGoals({
      proteinGoal: val,
      fatGoal: val2,
      carbGoal: val3,
      proteinCurrent: userGoals.proteinCurrent,
      fatCurrent: userGoals.fatCurrent,
      carbCurrent: userGoals.carbCurrent,
    });
    setMissGoals({
      sugarCurrent: missGoals.sugarCurrent,
      sugarGoal: val4,
      sodiumCurrent: missGoals.sodiumCurrent,
      sodiumGoal: val5,
    });
  }

  function setGoals(val, val2, val3, val4, val5) {
    setUserGoals({
      proteinGoal: userGoals.proteinGoal,
      fatGoal: userGoals.fatGoal,
      carbGoal: userGoals.carbGoal,
      proteinCurrent: val,
      fatCurrent: val2,
      carbCurrent: val3,
    });
    setMissGoals({
      sugarCurrent: val4,
      sugarGoal: missGoals.sugarGoal,
      sodiumCurrent: val5,
      sodiumGoal: missGoals.sodiumGoal,
    });
  }

async function saveData(key, value){
  await AsyncStorage.setItem(key, value);

}


   const selectImage = () => {
    const options = {
      quality: 0.1,
      storageOptions: {
        skipBackup: true,
      },
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
      } else if (response.error) {
      } else if (response.customButton) {
      } else {
        const {fileName, type, uri, fileSize} = response;

        setImagePath(uri);
        saveData('@userImageURI', uri)
      }
    });
  };

  return (
    <>
      <app_context.Provider
        value={{
          selectImage,
          imagePath,
          User,
          APItoken: APIT,
        }}>
        <user_context.Provider
          value={{
            macroData: macroData.data,
            graphData,
            userGoals,
            setGoalsR,
            date,
            DisplayDate,
            incrementDate,
            decrementDate,
             editDate
            
          }}>
          <water_context.Provider
            value={{
              waterGoals,
              increaseWaterLevel,
              decreaseWaterLevel,
              setWaterGoal,
              updateWaterTracker,
              waterText,
            }}>
            <foodLog_context.Provider
              value={{
                editBFLogData,
                editLunchLogData,
                editDinnerLogData,
                editSnackLogData,
                removeBFLogData,
                removeLunchLogData,
                removeDinnerLogData,
                removeSnackLogData,
                setLogQuantity,
                BFLogRef,
                LunchLogRef,
                DinnerLogRef,
                SnackLogRef,
              }}>
              <View style={{flex: 1}}>
                
                <RootNavigation />
                
              </View>
            </foodLog_context.Provider>
          </water_context.Provider>
        </user_context.Provider>
      </app_context.Provider>
    </>
  );
};
export default Root;
