import colors from '@/styles/colors';
import { StyleSheet } from 'react-native';

export const roundButtonStyles = StyleSheet.create({
    base: {
        backgroundColor: colors.purple,
        borderColor: colors.lightPurple,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },

    xs: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 1,
    },
    sm: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
    },
    md: {
        width: 56,
        height: 56,
        borderRadius: 28,
        borderWidth: 2,
    },
    lg: {
        width: 72,
        height: 72,
        borderRadius: 36,
        borderWidth: 3,
    },
    xl: {
        width: 88,
        height: 88,
        borderRadius: 44,
        borderWidth: 3,
    },
    xxl: {
        width: 104,
        height: 104,
        borderRadius: 52,
        borderWidth: 4,
    },

    topLeft: {
        position: 'absolute',
        top: 20,
        left: 40,
        zIndex: 1000,
        padding: 10,
    },
    topRight: {
        position: 'absolute',
        top: 20,
        right: 40,
        zIndex: 1000,
        padding: 10,
    },
});
