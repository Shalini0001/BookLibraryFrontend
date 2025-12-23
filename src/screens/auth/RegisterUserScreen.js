import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState, } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ScrollView, Alert
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL, ENDPOINTS } from '../../utils/constants';

const RegisterUserScreen = ({ }) => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [month, setMonth] = useState('');
    const [day, setDay] = useState('');
    const [year, setYear] = useState('');
    // const [pronoun, setPronoun] = useState('');
    const [errors, setErrors] = useState({ email: '', username: '', dob: '' });
    const [isFormValid, setIsFormValid] = useState(false);
    const { login } = useContext(AuthContext);

 const onContinue = async () => {
    if (!isFormValid) return;

    try {
        const token = await AsyncStorage.getItem('token');
        
        const res = await fetch(ENDPOINTS.UPDATE_PROFILE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ 
                email, 
                username, 
                dob: `${year}-${month}-${day}` 
            })
        });

        const data = await res.json();
        
        // DEBUG: Ensure this logs an object that contains the new username
        console.log("Profile Update Response:", data); 

        if (res.ok && data.user) {
         
            login(data.user, token, true);
        } else {
            Alert.alert(data.message || "Failed to update profile.");
        }
    } catch (error) {
        console.error("Update Error:", error);
        Alert.alert("An error occurred. Please check your connection.");
    }
};


    useEffect(() => {
        const newErrors = { email: '', username: '', dob: '' };

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) newErrors.email = 'Email is required.';
        else if (!emailRegex.test(email)) newErrors.email = 'Enter a valid email address.';

        // Username validation
        if (!username) newErrors.username = 'Username is required.';
        else if (username.length < 3) newErrors.username = 'Username must be at least 3 characters.';

        // DOB validation
        if (!month || !day || !year) {
            newErrors.dob = 'Complete birthday is required.';
        } else {
            const mm = parseInt(month, 10);
            const dd = parseInt(day, 10);
            const yy = parseInt(year, 10);
            const isNumeric = Number.isFinite(mm) && Number.isFinite(dd) && Number.isFinite(yy);

            const validDate = isNumeric && isValidDate(yy, mm, dd);
            if (!validDate) newErrors.dob = 'Enter a valid date.';
            else if (!isOldEnough(yy, mm, dd, 13)) newErrors.dob = 'You must be at least 13 years old.';
        }

        setErrors(newErrors);
        const formOk = !newErrors.email && !newErrors.username && !newErrors.dob;
        setIsFormValid(formOk);
    }, [email, username, month, day, year]);

    // Helpers
    function isValidDate(y, m, d) {
        if (y < 1900 || y > new Date().getFullYear()) return false;
        if (m < 1 || m > 12) return false;
        const date = new Date(y, m - 1, d);
        return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
    }

    function isOldEnough(y, m, d, minAge) {
        const today = new Date();
        const birth = new Date(y, m - 1, d);
        let age = today.getFullYear() - birth.getFullYear();
        const mDiff = today.getMonth() - birth.getMonth();
        if (mDiff < 0 || (mDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age >= minAge;
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
        
            <Text style={styles.title}>Tell us about yourself</Text>
            <Text style={styles.label}>Email</Text>
            <TextInput
                placeholder="Email"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            {!!errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

            <Text style={styles.label}>Username</Text>
            <TextInput
                placeholder="Username"
                style={styles.input}
                value={username}
                onChangeText={setUsername}
            />
            {!!errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
            <Text style={styles.helperText}>
                You don’t have to use your real name. You can choose to use another
                name to protect your privacy.
            </Text>

            <Text style={styles.label}>When's your birthday?</Text>
            <View style={styles.row}>
                <TextInput
                    placeholder="MM"
                    style={[styles.input, styles.dateInput]}
                    keyboardType="number-pad"
                    maxLength={2}
                    value={month}
                    onChangeText={setMonth}
                />
                <TextInput
                    placeholder="DD"
                    style={[styles.input, styles.dateInput]}
                    keyboardType="number-pad"
                    maxLength={2}
                    value={day}
                    onChangeText={setDay}
                />
                <TextInput
                    placeholder="YYYY"
                    style={[styles.input, styles.dateInput]}
                    keyboardType="number-pad"
                    maxLength={4}
                    value={year}
                    onChangeText={setYear}
                />
            </View>
            {!!errors.dob && <Text style={styles.errorText}>{errors.dob}</Text>}
            <Text style={styles.helperText}>
                Your birthday is only visible to you and Domato’s support team.
            </Text>

            {/* Pronouns */}
            {/* <Text style={styles.label}>Pronouns (optional)</Text>
            <TextInput
                placeholder="Pronouns (optional)"
                style={styles.input}
                value={pronoun}
                onChangeText={setPronoun}
            />
            <Text style={styles.helperText}>
                Your pronouns are only visible to you and Domato’s support team.
            </Text> */}

            <TouchableOpacity
                style={[styles.button, !isFormValid && styles.buttonDisabled]}
                onPress={onContinue}
                disabled={!isFormValid}
            >
                <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default RegisterUserScreen;
const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#fff',
        padding: 24
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginTop: 16,
        marginBottom: 6
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 30,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16
    },
    helperText: {
        fontSize: 12,
        color: '#777',
        marginTop: 6
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    dateInput: {
        width: '30%',
        textAlign: 'center'
    },
    button: {
        backgroundColor: '#000',
        borderRadius: 30,
        paddingVertical: 16,
        marginTop: 40
    },
    buttonDisabled: {
        opacity: 0.6,
        backgroundColor: '#000'
    },
    errorText: {
        color: '#d9534f',
        marginTop: 6,
        fontSize: 12
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center'
    }
});
