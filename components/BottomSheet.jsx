import { View, StyleSheet } from 'react-native'
import React, { forwardRef, useCallback, useEffect, useImperativeHandle } from 'react'
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { Extrapolate, interpolate, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import DIMENSION from '../constants/DIMENSION'

/* constants */
const { SCREEN_WIDTH, SCREEN_HEIGHT } = DIMENSION;
const MAX_TRANS_Y = -SCREEN_HEIGHT + 70
const MIN_TRANS_Y = -SCREEN_HEIGHT / 3

const BottomSheet = forwardRef(
    ({ children }, ref) => {
        /* shared values */
        const bottomSheetTransY = useSharedValue(0);
        const bottomSheetContext = useSharedValue(0);

        /* callbacks */
        const scrollTo = useCallback((destination) => {
            'worklet';
            bottomSheetTransY.value = withSpring(destination, { damping: 17.5 });
        }, []);
        useImperativeHandle(ref,
            () => ({
                // methods
                scrollTo,
            }),
            // deps
            [scrollTo])

        /* gestures */
        const gesture = Gesture.Pan()
            .onStart(() => {
                // automatically drag to MIN_TRANS_Y at beginning
                bottomSheetContext.value = bottomSheetTransY.value;
            })
            .onUpdate(e => {
                // e.translationY: mouse position change relative to the starting position
                // bottomSheetContext.value: bottomSheet start position
                // bottomSheetTransY.value: bottomSheet current position
                bottomSheetTransY.value = e.translationY + bottomSheetContext.value;
                bottomSheetTransY.value = Math.max(-SCREEN_HEIGHT, bottomSheetTransY.value);
            })
            .onEnd(() => {
                if (bottomSheetTransY.value > MIN_TRANS_Y) {
                    scrollTo(MIN_TRANS_Y)
                } else if (bottomSheetTransY.value < MIN_TRANS_Y || bottomSheetTransY.value < MAX_TRANS_Y) {
                    scrollTo(MAX_TRANS_Y)
                }
            });

        /* styles */
        const rBottomSheetStyle = useAnimatedStyle(() => {
            const borderRadius = interpolate(
                bottomSheetTransY.value,
                [MAX_TRANS_Y / 2, MAX_TRANS_Y],
                [20, 40],
                Extrapolate.CLAMP
            );
            return {
                borderRadius: borderRadius,
                transform: [
                    { translateY: bottomSheetTransY.value }
                ]
            }
        })
        const rHandleBarStyle = useAnimatedStyle(() => {
            const width = interpolate(
                bottomSheetTransY.value,
                [-SCREEN_HEIGHT, 0],
                [0.15 * SCREEN_WIDTH, 0.225 * SCREEN_WIDTH],
                Extrapolate.CLAMP
            )
            return {
                width: width,
            }
        })

        /* render */
        useEffect(() => {
            scrollTo(MIN_TRANS_Y)
        }, [])
        return (
            <GestureDetector gesture={gesture}>
                <Animated.View style={[styles.bottomSheetContainer, rBottomSheetStyle]}>
                    <Animated.View style={[styles.handleBar, rHandleBarStyle]} />
                    {children}
                </Animated.View>
            </GestureDetector>
        )
    }
)

export default BottomSheet

const styles = StyleSheet.create({
    bottomSheetContainer: {
        width: "100%",
        height: SCREEN_HEIGHT,
        backgroundColor: "#ffffff",
        borderRadius: 20,
        position: "absolute",
        top: SCREEN_HEIGHT
    },
    handleBar: {
        width: 0.175 * SCREEN_WIDTH,
        height: 5,
        marginBottom: 22.5,
        backgroundColor: "gray",
        alignSelf: "center",
        marginVertical: 12,
        borderRadius: 10,
    }
})