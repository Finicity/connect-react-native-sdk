import React, {useState, useRef} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {Connect} from 'connect-react-native-sdk';

const App = () => {
  const [url, setUrl] = useState('');
  const [pressable, setPressable] = useState(false);
  const [show, setShow] = useState(false);
  const urlInputRef = useRef<TextInput>(null);

  const handleUrl = (text: string) => {
    setUrl(text);
    setPressable(text.length > 0);
  };

  const onConnectWithUrl = () => {
    if (Platform.OS === 'android' && url.includes('localhost')) {
      let testurl = url.replace('localhost', '10.0.2.2');
      setUrl(testurl);
    }
    setShow(true);
  };

  const onPressHandler = () => {
    if (pressable) {
      onConnectWithUrl();
    }
    urlInputRef.current?.clear();
  };

  const eventHandlers = {
    onCancel: (event: any) => {
      console.log('cancel event received', event);
      setShow(false);
      handleUrl('');
    },
    onDone: (event: any) => {
      console.log('done event received', event);
      setShow(false);
      handleUrl('');
    },
    onError: (event: any) => {
      console.log('error event received', event);
      setShow(false);
      handleUrl('');
    },
    onLoad: () => {
      console.log('loaded event received');
    },
    onRoute: (event: any) => {
      console.log('route event received', event);
    },
    onUser: (event: any) => {
      console.log('user event received', event);
    },
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Text style={styles.textTitle}>Connect SDK demo app</Text>

        <Text style={styles.textInstructions}>
          To get started, copy/paste a Generate URL value into the field below.
        </Text>

        <TextInput
          ref={urlInputRef}
          style={styles.textInput}
          placeholder="Paste Generate URL here"
          onChangeText={handleUrl}
        />

        <TouchableOpacity
          disabled={!pressable}
          style={
            pressable
              ? styles.buttonFrameStyleEnabled
              : styles.buttonFrameStyleDisabled
          }
          onPress={onPressHandler}>
          <Text
            style={
              pressable
                ? styles.buttonTextStyleEnabled
                : styles.buttonTextStyleDisabled
            }>
            Launch Connect
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
      {show === true && (
        <Connect connectUrl={url} eventHandlers={eventHandlers} />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  textTitle: {
    color: 'black',
    fontSize: 30,
    fontWeight: 'bold',
    width: '85%',
    marginTop: 30,
  },
  textInstructions: {
    color: 'black',
    fontSize: 16,
    width: '85%',
  },
  logoStyle: {
    width: 90,
    height: 70,
    marginTop: -50,
  },

  textInput: {
    height: 56,
    width: '90%',
    marginTop: 24,
    borderColor: '#C6CDD4',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEFEFE',
  },
  buttonFrameStyleDisabled: {
    height: 48,
    width: '95%',
    borderRadius: 24,
    marginTop: 12,
    backgroundColor: '#bdc3c7',
    justifyContent: 'center',
  },
  buttonFrameStyleEnabled: {
    height: 48,
    width: '95%',
    borderRadius: 24,
    marginTop: 12,
    backgroundColor: '#d35400',
    justifyContent: 'center',
  },
  buttonTextStyleDisabled: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    padding: 10,
    textAlign: 'center',
  },
  buttonTextStyleEnabled: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    padding: 10,
    textAlign: 'center',
  },
});

export default App;
