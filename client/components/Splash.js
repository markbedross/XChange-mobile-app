import {useEffect} from 'react';
import { Animated, StyleSheet} from 'react-native';

function Splash() {

    // set scale to animated value with default value of 0
    const scale = new Animated.Value(0)

    useEffect(()=>{ // on mount, perform a spring animation bringing the scale from 0 to 1
        Animated.spring(
            scale, {
                toValue: 1,
                friction: 3,
                useNativeDriver: true
            }
        ).start()
    }, [])

    return (
        <Animated.View style={styles.container}>
            <Animated.Image style={{transform: [{scale: scale}]}} // set scale property in transform to the animated scale value
            source={require('./sitelogo.png')} /* import site logo image */ />
        </Animated.View>
    );
}

export default Splash;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})