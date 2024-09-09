import { 
  DrawerLayoutAndroid, 
  SafeAreaView, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View,
  FlatList,
  Vibration,
  Alert,
  StatusBar
} from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Entypo, Feather, Ionicons, Octicons } from '@expo/vector-icons';
import { evaluate } from 'mathjs';

export default function ScientificScreen() {
  const navigation = useNavigation();
  const drawer = useRef('');

  const [darkMode, setDarkMode] = useState(false);
  const [deg, setDeg] = useState(false);
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [stack, setStack] = useState('');
  const [history, setHistory] = useState([]);

  const openCount = (stack.match(/\(/g) || []).length;
  const closeCount = (stack.match(/\)/g) || []).length;

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  const buttons = [
    'Rad', '√', 'cot', 'C', '()', '%', '/',
    'sin', 'cos', 'tan', '7', '8', '9', '*',
    'ln', 'log', '1/x', '4', '5', '6', '-',
    'eˣ', 'x²', 'xʸ', '1', '2', '3', '+',
    '|x|', 'π', 'e', '+/-', '0', '.', '='
  ];

  const calculator = () => {
    try {
      let lastArr = expression[expression.length - 1];
      if (lastArr === '/' || lastArr === '*' || lastArr === '-', lastArr === '+' || lastArr === '.') {
        setExpression(expression);
        return;
      }
      else {
        let res;
        if (deg && (expression.indexOf('sin') === 0 || expression.indexOf('cos') === 0 || expression.indexOf('tan') === 0 || expression.indexOf('cot') === 0)) {
          const regex = /(sin|cos|tan|cot)\(([^)]+)\)/g;
          let newExpression = expression.replace(regex, (match, p1, p2) => {
            return `${p1}(${p2} deg)`;
          })
          res = evaluate(newExpression)
        }
        else {
          let newExpression = expression;
          if (expression.indexOf('√') === 0) {
            newExpression = expression.replace('√', 'sqrt');
          }
          if (expression.indexOf('ln') === 0) {
            newExpression = expression.replace('ln', 'log');
          }
          if (expression.indexOf('log') === 0) {
            newExpression = expression.slice(0, expression.length-1) + ', 10' + expression.slice(expression.length-1);
          }
          if (expression.indexOf('π') === 0) {
            newExpression = expression.replace('π', 'pi');
          }
          res = evaluate(newExpression);
        }
        setResult(res);
        setHistory([...history, { expression, result: res }])
        return;
      }
    } catch (err) {
      Alert.alert('Warning', 'Your expression invalid.')
    }
  };

  const navigationView = () => {
    return (
      <View style={{margin: 20, alignItems: 'center'}}>
        <FlatList 
          style={{alignSelf: 'flex-end', height: '30%'}}
          data={history}
          renderItem={({ item }) => (
            <View style={{marginBottom: 20}}>
              <TouchableOpacity onPress={() => handleSetHistoryExpression(item.expression)}>
                <Text style={{fontSize: 20, alignSelf: 'flex-end'}}>{item.expression}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleSetHistoryExpression(item.result)}>
                <Text style={{fontSize: 20, alignSelf: 'flex-end', color: '#5c971d'}}>= {item.result}</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
        <TouchableOpacity 
          style={styles.clearHistoryButton}
          onPress={() => handleClearHistory()}
        >
          <Text style={{fontSize: 15}}>Clear History</Text>
        </TouchableOpacity>
      </View>
    )
  };

  const handleInput = (buttonPressed) => {
    if (buttonPressed === '+' || buttonPressed === '-' || buttonPressed === '*' || buttonPressed === '/') {
      Vibration.vibrate(35);
      setExpression(expression + buttonPressed);
      return;
    }
    else if (buttonPressed === '()') {
      if (expression.length === 0) {
        setExpression(expression + '(');
        setStack(stack + '(');
      }
      else if (expression.charAt(expression.length-1) === '(') {
        setExpression(expression + '(');
        setStack(stack + '(');
      }
      else if (openCount > closeCount) {
        setExpression(expression + ')');
        setStack(stack + ')');
      }
      else {
        setExpression(expression + '*(');
        setStack(stack + '(');
      }
    }
    else if (buttonPressed === '√' || buttonPressed === 'sin' || buttonPressed === 'cos' || buttonPressed === 'tan' || 
            buttonPressed === 'ln' || buttonPressed === 'log' || buttonPressed === 'cot') {
      let last = expression.charAt(expression.length - 1);
      if (expression.length === 0) {
        setExpression(expression + buttonPressed + '(');
        setStack(stack + '(');
      }
      else if (last >= '1' && last <= '9') {
        setExpression(expression + '*' + buttonPressed + '(');
        setStack(stack + '(');
      }
      else {
        setExpression(expression + buttonPressed + '(');
        setStack(stack + '(');
      }
    }
    else if (buttonPressed === '1' || buttonPressed === '2' || buttonPressed === '3' || buttonPressed === '4' || buttonPressed === '5' ||
            buttonPressed === '6' || buttonPressed === '7' || buttonPressed === '8' || buttonPressed === '9' || buttonPressed === '.') {
      Vibration.vibrate(35);
      setExpression(expression + buttonPressed);
    }
    else if (buttonPressed === '0' && expression.length !== 0) {
      Vibration.vibrate(35);
      setExpression(expression + buttonPressed);
    }

    let last;
    switch(buttonPressed) {
      case 'C':
        Vibration.vibrate(35);
        setResult('');
        setExpression('');
        setStack('');
        return;
      case '=':
        Vibration.vibrate(35);
        setExpression(expression);
        calculator();
        return;
      case '%': 
        Vibration.vibrate(35);
        setExpression(expression + '%');
        return;
      case '1/x':
        Vibration.vibrate(35);
        setExpression(expression + '1/');
        return;
      case 'x²':
        Vibration.vibrate(35);
        last = expression.charAt(expression.length - 1);
        if ((last >= '0' && last <= '9') || last === ')') {
          setExpression(expression + '^(2)');
        }
        return;
      case 'xʸ':
        Vibration.vibrate(35);
        last = expression.charAt(expression.length - 1);
        if (last >= '0' && last <= '9') {
          setExpression(expression + '^(');
          setStack(stack + '(');
        }
        return;
      case '|x|':
        Vibration.vibrate(35);
        last = expression.charAt(expression.length - 1);
        if (last >= '0' && last <= '9') {
          setExpression(expression + '*abs(');
        }
        else {
          setExpression(expression + 'abs(');
        }
        setStack(stack + '(');
        return;
      case 'eˣ':
        Vibration.vibrate(35);
        last = expression.charAt(expression.length - 1);
        if (last >= '0' && last <= '9') {
          setExpression(expression + '*e^(');
        }
        else {
          setExpression(expression + 'e^(');
        }
        setStack(stack + '(');
        return;
      case 'π':
        setExpression(expression + 'π');
        return;
      case 'e':
        setExpression(expression + 'e');
        return;
    }
  };
  const handleDelete = () => {
    setExpression(expression.substring(0, expression.length - 1));
  }
  const handleClearHistory = () => {
    setHistory([]);
  }
  const handleSetHistoryExpression = (text) => {
    setExpression(text);
  }

  return (
    <SafeAreaView>
      <StatusBar />
      <View style={[styles.result, {backgroundColor: darkMode ? '#010101' : '#fcfcfc'}]}>
        <TouchableOpacity style={styles.themeButton}>
          <Entypo 
            name={darkMode ? 'light-up' : 'moon'} 
            size={24}
            color={darkMode ? 'gray' : 'black'}
            onPress={() => darkMode ? setDarkMode(false): setDarkMode(true)}
          />
        </TouchableOpacity>
        <Text style={[styles.historyText, {color: darkMode ? 'white' : 'black'}]}>{expression}</Text>
        <Text style={[styles.resultText, {color: '#979797'}]}>{result}</Text>
      </View>
      <View style={[styles.container, {backgroundColor: darkMode ? '#010101' : '#fcfcfc'}]}>
        <View style={styles.functionButton}>
          <TouchableOpacity onPress={() => drawer.current.openDrawer()}>
            <Octicons name='history' size={25} color={darkMode ? 'white' : 'black'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Basic')}>
            <Ionicons name='calculator-outline' size={25} color={darkMode ? 'white' : 'black'} />
          </TouchableOpacity>
        </View>
        <View style={styles.deleteButton}>
          <TouchableOpacity onPress={() => handleDelete()}>
            <Feather name='delete' size={30} color={darkMode ? 'white' : 'black'} />
          </TouchableOpacity>
        </View>
      </View>
      <DrawerLayoutAndroid
        ref={drawer}
        drawerWidth={300}
        drawerPosition='left'
        renderNavigationView={navigationView}
        style={{minHeight: '100%', backgroundColor: darkMode ? '#010101' : '#fcfcfc'}}
      >
        <View style={styles.buttons}>
          {buttons.map((button) => (button === '()' || button === '%' || button === '/' || button === '*' || button === '-' || button === '+') ?
            <TouchableOpacity
              key={button}
              style={[styles.button, {backgroundColor: darkMode ? '#171717' : '#f8f8f8'}]}
              onPress={() => handleInput(button)}
            >
              <Text style={[styles.textButton, {color: '#569415'}]}>
                {button}
              </Text>
            </TouchableOpacity>
            :
            (button === 'C') ?
            <TouchableOpacity
              key={button}
              style={[styles.button, {backgroundColor: darkMode ? '#171717' : '#f8f8f8'}]}
              onPress={() => handleInput(button)}
            >
              <Text style={[styles.textButton, {color: '#e4684e'}]}>{button}</Text>
            </TouchableOpacity>
            :
            (button === '=') ?
            <TouchableOpacity
              key={button}
              style={[styles.button, {backgroundColor: '#68b31a'}]}
              onPress={() => handleInput(button)}
            >
              <Text style={[styles.textButton, {color: '#fafafa'}]}>{button}</Text>
            </TouchableOpacity>
            :
            (button === 'Rad') ?
            <TouchableOpacity
              key={button}
              style={[styles.button, {backgroundColor: darkMode ? '#171717' : '#f8f8f8'}]}
              onPress={() => setDeg(!deg)}
            >
              <Text style={[styles.textButton, {color: darkMode ? 'white' : 'black'}]}>
                {deg ? 'Deg' : button}
              </Text>
            </TouchableOpacity>
            :
            <TouchableOpacity
              key={button}
              style={[styles.button, {backgroundColor: darkMode ? '#171717' : '#f8f8f8'}]}
              onPress={() => handleInput(button)}
            >
              <Text style={[styles.textButton, {color: darkMode ? 'white' : 'black'}]}>{button}</Text>
            </TouchableOpacity>
          )}
        </View>
      </DrawerLayoutAndroid>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  clearHistoryButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ededed',
    width: '45%',
    height: '15%',
    borderRadius: 50
  },
  result: {
    backgroundColor: '#f5f5f5',
    maxWidth: '100%',
    height: 120,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    paddingRight: 70,
    paddingTop: 15,
    paddingLeft: 70
  },
  resultText: {
    marginTop: 5,
    marginRight: 15,
    marginBottom: 10,
    fontSize: 20,
    flexDirection: 'row',
  },
  historyText: {
    fontSize: 20,
    marginRight: 10,
    alignSelf: 'flex-end',
    flexDirection: 'row',
  },
  themeButton: {
    alignSelf: 'flex-start',
    bottom: '5%',
    backgroundColor: '#e5e5e5',
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
    borderRadius: 25,
  },
  container: {
    flexDirection: 'row',
    width: '100%',
    borderBottomWidth: 1,
    borderColor: '#e6e6e6',
  },
  functionButton: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '30%',
    marginBottom: 10
  },
  deleteButton: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    width: '58%',
    marginBottom: 10
  },
  buttons: {
    width: '100%',
    height: '35%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    paddingLeft: 50,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '8%',
    minHeight: '20%',
    flex: 2,
    borderRadius: 100,
    marginBottom: 7,
    marginRight: 40,
    marginTop: 7
  },
  textButton: {
    color: '#555555',
    fontSize: 20,
    fontWeight: '400',
  }
})