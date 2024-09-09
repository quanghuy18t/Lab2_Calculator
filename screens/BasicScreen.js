import { StatusBar } from 'expo-status-bar';
import { 
  Alert,
  DrawerLayoutAndroid,
  FlatList,
  SafeAreaView, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  Vibration, 
  View 
} from 'react-native';
import { Entypo, Feather, Ionicons, Octicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import * as ScreenOrientation from 'expo-screen-orientation';

export default function BasicScreen() {
  const navigation = useNavigation();
  const drawer = useRef(null);

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  const [darkMode, setDarkMode] = useState(false);
  const [result, setResult] = useState('');
  const [expression, setExpression] = useState('');
  const [history, setHistory] = useState([]);

  const [stack, setStack] = useState('');
  const openCount = (stack.match(/\(/g) || []).length;
  const closeCount = (stack.match(/\)/g) || []).length;

  const buttons = ['C', '()', '%', '/', '7', '8', '9', '*', '4', '5', '6', '-', '1', '2', '3', '+', '+/-', '0', '.', '='];

  const calculator = () => {
    try {
      let lastArr = expression[expression.length - 1];
      if (lastArr === '/' || lastArr === '*' || lastArr === '-', lastArr === '+' || lastArr === '.') {
        setExpression(expression);
        return;
      }
      else if (lastArr === '%') {
        let tmp = expression.slice(0, -1);
        let res = (eval(tmp))/100;
        setResult(res);
        setHistory([...history, { expression, result: res }])
        return;
      }
      else {
        let res = eval(expression).toString();
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
          style={{alignSelf: 'flex-end', height: '41%'}}
          data={history}
          renderItem={({ item }) => (
            <View style={{marginBottom: 20}}>
              <TouchableOpacity onPress={() => setExpression(item.expression)}>
                <Text style={{fontSize: 25, alignSelf: 'flex-end'}}>{item.expression}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setExpression(item.result)}>
                <Text style={{fontSize: 25, alignSelf: 'flex-end', color: '#5c971d'}}>= {item.result}</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
        <TouchableOpacity 
          style={styles.clearHistoryButton}
          onPress={() => handleClearHistory()}
        >
          <Text style={{fontSize: 20}}>Clear History</Text>
        </TouchableOpacity>
      </View>
    )
    
  }

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
        setStack('(');
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
    }
  };
  const handleDelete = () => {
    setExpression(expression.substring(0, expression.length - 1));
  }
  const handleClearHistory = () => {
    setHistory([]);
  }

  return (
    <SafeAreaView>
      <StatusBar translucent={true} />
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
      <View style={[styles.container,{backgroundColor: darkMode ? '#010101' : '#fcfcfc'}]}>
        <View style={styles.functionButton}>
          <TouchableOpacity onPress={() => drawer.current.openDrawer()}>
            <Octicons name='history' size={30} color={darkMode ? 'white' : 'black'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Scientific')}>
            <Ionicons name='calculator-outline' size={30} color={darkMode ? 'white' : 'black'} />
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
  );
}

const styles = StyleSheet.create({
  clearHistoryButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ededed',
    width: '60%',
    height: '15%',
    borderRadius: 50
  },
  result: {
    backgroundColor: '#f5f5f5',
    maxWidth: '100%',
    minHeight: '35%',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  resultText: {
    maxHeight: 45,
    margin: 15,
    fontSize: 35,
  },
  historyText: {
    fontSize: 35,
    marginRight: 10,
    alignSelf: 'flex-end',
  },
  themeButton: {
    alignSelf: 'flex-start',
    bottom: '5%',
    margin: 15,
    backgroundColor: '#e5e5e5',
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 30,
  },
  container: {
    flexDirection: 'row',
    width: '100%',
    borderBottomWidth: 1,
    borderColor: '#e6e6e6',
  },
  functionButton: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '50%',
    marginBottom: 10
  },
  deleteButton: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    width: '42%',
    marginBottom: 10
  },
  buttons: {
    width: '100%',
    height: '35%',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '18%',
    minHeight: '30%',
    flex: 2,
    borderRadius: 100,
    margin: 5,
  },
  textButton: {
    color: '#555555',
    fontSize: 35,
    fontWeight: '400',
  }
});
