import React, { useState } from 'react';
import {
View,
Text,
TextInput,
TouchableOpacity,
StyleSheet,
SafeAreaView,
KeyboardAvoidingView,
Platform,
ScrollView,
ImageBackground,
Image,
} from 'react-native';

const LoginScreen = ({
onLogin,
onGoogleLogin,
onFacebookLogin,
onAppleLogin,
onSignUp
}) => {
const [username, setUsername] = useState('');
const [password, setPassword] = useState('');
const [fbImgError, setFbImgError] = useState(false);
const [appleImgError, setAppleImgError] = useState(false);
const [googleImgError, setGoogleImgError] = useState(false);

const handleLogin = () => {
if (onLogin) {
onLogin({ username, password });
}
};

const handleGoogleLogin = () => {
if (onGoogleLogin) {
onGoogleLogin();
}
};

const handleFacebookLogin = () => {
if (onFacebookLogin) {
onFacebookLogin();
}
};

const handleAppleLogin = () => {
if (onAppleLogin) {
onAppleLogin();
}
};

const handleSignUp = () => {
if (onSignUp) {
onSignUp();
}
};

return (
<ImageBackground
source={require('./assets/background.png')}
style={styles.backgroundImage}
resizeMode="cover"
>
<SafeAreaView style={styles.container}>
<KeyboardAvoidingView
behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
style={styles.keyboardView}
>
<ScrollView
contentContainerStyle={styles.scrollContent}
showsVerticalScrollIndicator={false}
>
{}
<View style={styles.formContainer}>
<Text style={styles.title}>Login</Text>

          {}
          <TextInput
            style={styles.input}
            placeholder="UserName:"
            placeholderTextColor="#999"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
          />

          {}
          <TextInput
            style={styles.input}
            placeholder="Password:"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />

          {}
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={handleLogin}
            activeOpacity={0.8}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          {}
          <Text style={styles.dividerText}>or</Text>

          {}
          <TouchableOpacity 
            style={[styles.socialButton, styles.googleButton]}
            onPress={handleGoogleLogin}
            activeOpacity={0.8}
          >
            <Image
              source={require('./assets/google.png')}
              style={[styles.socialLogo, styles.socialLogoGoogle]}
              resizeMode="contain"
            />
            <Text style={[styles.socialButtonText, styles.socialButtonTextDark]}>Continue with Google</Text>
          </TouchableOpacity>

          {}
          <TouchableOpacity 
            style={[styles.socialButton, styles.facebookButton]}
            onPress={handleFacebookLogin}
            activeOpacity={0.8}
          >
            {!fbImgError ? (
              <Image
                source={require('./assets/facebook.png')}
                style={[styles.socialLogo, styles.socialLogoFacebook]}
                resizeMode="contain"
                onError={(e) => { console.warn('facebook image error', e.nativeEvent); setFbImgError(true); }}
                onLoad={() => console.log('facebook loaded')}
              />
            ) : (
              <View style={[styles.iconFallback, styles.iconFallbackFacebook]}>
                <Text style={styles.iconFallbackText}>f</Text>
              </View>
            )}
            <Text style={styles.socialButtonText}>Continue with Facebook</Text>
          </TouchableOpacity>

          {}
          <TouchableOpacity 
            style={[styles.socialButton, styles.appleButton]}
            onPress={handleAppleLogin}
            activeOpacity={0.8}
          >
            {!appleImgError ? (
              <Image
                source={require('./assets/apple-logo.png')}
                style={[styles.socialLogo, styles.socialLogoApple]}
                resizeMode="contain"
                onError={(e) => { console.warn('apple image error', e.nativeEvent); setAppleImgError(true); }}
                onLoad={() => console.log('apple loaded')}
              />
            ) : (
              <View style={[styles.iconFallback, styles.iconFallbackApple]}>
                <Text style={styles.iconFallbackText}></Text>
              </View>
            )}
            <Text style={styles.socialButtonText}>Continue with Apple</Text>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don't have an account? </Text>
            <TouchableOpacity onPress={handleSignUp}>
              <Text style={styles.signUpLink}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  </SafeAreaView>
</ImageBackground>
);
};

const styles = StyleSheet.create({
backgroundImage: {
flex: 1,
width: '100%',
height: '100%',
},
container: {
flex: 1,
backgroundColor: 'transparent',
},
keyboardView: {
flex: 1,
},
scrollContent: {
flexGrow: 1,
justifyContent: 'center',
alignItems: 'center',
padding: 20,
},
formContainer: {
width: '100%',
maxWidth: 400,
padding: 30,
borderWidth: 2,
borderColor: '#4A90E2',
borderStyle: 'dashed',
borderRadius: 10,
backgroundColor: '#fff',
alignItems: 'center',
},
title: {
fontSize: 40,
fontWeight: '600',
color: '#4A90E2',
marginBottom: 30,
},
input: {
width: '100%',
height: 50,
borderWidth: 2,
borderColor: '#4A90E2',
borderRadius: 5,
paddingHorizontal: 15,
marginBottom: 15,
fontSize: 14,
color: '#333',
},
loginButton: {
width: '60%',
height: 45,
backgroundColor: '#4A90E2',
borderRadius: 5,
justifyContent: 'center',
alignItems: 'center',
marginTop: 10,
marginBottom: 15,
},
loginButtonText: {
color: '#fff',
fontSize: 16,
fontWeight: '600',
},
dividerText: {
fontSize: 14,
color: '#999',
marginVertical: 15,
},
socialButton: {
width: '100%',
height: 50,
borderRadius: 8,
justifyContent: 'flex-start',
alignItems: 'center',
marginBottom: 12,
flexDirection: 'row',
paddingHorizontal: 18,
},
googleButton: {
backgroundColor: '#fff',
borderWidth: 1,
borderColor: '#e6e9ee',
},
facebookButton: {
backgroundColor: '#1877F2',
},
appleButton: {
backgroundColor: '#000',
},
socialLogo: {
width: 20,
height: 20,
marginRight: 12,
},
socialLogoGoogle: {
width: 24,
height: 24,
},
socialLogoFacebook: {
width: 20,
height: 20,
},
socialLogoApple: {
width: 18,
height: 22,
},
iconFallback: {
width: 28,
height: 28,
borderRadius: 14,
alignItems: 'center',
justifyContent: 'center',
marginRight: 12,
},
iconFallbackText: {
color: '#fff',
fontSize: 14,
fontWeight: '700',
},
iconFallbackFacebook: {
backgroundColor: 'transparent',
},
iconFallbackApple: {
backgroundColor: 'transparent',
},
socialButtonText: {
color: '#fff',
fontSize: 15,
fontWeight: '600',
},
socialButtonTextDark: {
color: '#0f1724',
fontWeight: '600',
},
signUpContainer: {
flexDirection: 'row',
marginTop: 20,
},
signUpText: {
fontSize: 14,
color: '#333',
},
signUpLink: {
fontSize: 14,
color: '#4A90E2',
fontWeight: '600',
},
});

export default LoginScreen;