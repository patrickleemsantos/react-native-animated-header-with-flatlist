import React, {
  useState
} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Animated
} from 'react-native';

const list = [
  'https://i.picsum.photos/id/0/5616/3744.jpg',
  'https://i.picsum.photos/id/1/5616/3744.jpg',
  'https://i.picsum.photos/id/10/2500/1667.jpg',
  'https://i.picsum.photos/id/100/2500/1656.jpg',
  'https://i.picsum.photos/id/1000/5626/3635.jpg',
  'https://i.picsum.photos/id/1001/5616/3744.jpg',
  'https://i.picsum.photos/id/1024/1920/1280.jpg',
  'https://i.picsum.photos/id/1023/3955/2094.jpg',
  'https://i.picsum.photos/id/1022/6000/3376.jpg',
  'https://i.picsum.photos/id/1021/2048/1206.jpg'
];

const HEADER_HEIGHT = 100;

function App() {
  const [scrollAnim] = useState(new Animated.Value(0));
  const [offsetAnim] = useState(new Animated.Value(0));
  const [clampedScroll, setClampedScroll] = useState(Animated.diffClamp(
    Animated.add(
      scrollAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
        extrapolateLeft: 'clamp'
      }),
      offsetAnim
    ), 0, 1
  ));

  const navbarTranslate = clampedScroll.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -HEADER_HEIGHT],
    extrapolate: 'clamp'
  });

  renderList = ({item}) => {
    return (
      <Image source={{ uri: item }} style={{ width: '100%', height: 300 }} />
    )
  }

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[styles.header, {
          transform: [{ translateY: navbarTranslate }]
        }]}
        onLayout={(event) => {
          let {height} = event.nativeEvent.layout;
          setClampedScroll(Animated.diffClamp(
            Animated.add(
              scrollAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
                extrapolateLeft: 'clamp'
              }),
              offsetAnim
            ), 0, height)
          );
        }}
      >
        <Text style={styles.headerText}>HEADER</Text>
      </Animated.View>
      <Animated.FlatList 
        contentInset={{ top: HEADER_HEIGHT }}
        contentOffset={{ y: -HEADER_HEIGHT }}
        bounces={false}
        scrollEventThrottle={16}
        style={{ flexGrow: 1, width: '100%' }}
        data={list}
        renderItem={renderList}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: { y: scrollAnim }
              }
            }
          ],
          { useNativeDriver: true }
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 10000
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 20
  }
});

export default App;
