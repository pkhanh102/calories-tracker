import React, { useContext, useState } from 'react';
import {
    Box,
    Button,
    Container,
    FormControl,
    FormLabel,
    Input,
    Heading,
    Text,
    Alert,
    AlertIcon,
    AlertDescription,
    VStack,
    useColorModeValue,
    Image
} from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import API_BASE from "../apiConfig";
import AuthContext from '../context/AuthContext';  
import MacroMateIconBRM from '../assests/MacroMateIconBRM.png';

function LoginPage() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const res = await axios.post(`${API_BASE}/auth/login`, formData);
            login(res.data.token);
            navigate('/');
        } catch (err) {
            console.error(err);
            setMessage('❌ Login failed. Check your email and password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxW="md" py={20}>
            <Box
                borderWidth="1px"
                borderRadius="lg"
                p={8}
                boxShadow="md"
                bg={useColorModeValue('white', 'gray.800')}
                textAlign="center"
            >
                <Image
                    src={MacroMateIconBRM}
                    alt='MacroMate Logo'
                    boxSize="100px"
                    mx="auto"
                />

                <Heading size="lg" mb={6} textAlign="center" color="green.600">
                    Log in to MacroMate
                </Heading>

                {message && (
                    <Alert status="error" mb={4} rounded="md">
                        <AlertIcon />
                        <AlertDescription>{message.replace(/^✅\s*|^❌\s*/, '')}</AlertDescription>
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <VStack spacing={4}>
                        <FormControl isRequired>
                            <FormLabel>Email</FormLabel>
                            <Input
                                name="email"
                                type='email'
                                value={formData.email}
                                onChange={handleChange}
                                placeholder='you@example.com'
                            />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Password</FormLabel>
                            <Input
                                name="password"
                                type='password'
                                value={formData.password}
                                onChange={handleChange}
                                placeholder='*********'
                            />
                        </FormControl>

                        <Button
                            type="submit"
                            colorScheme="green"
                            width="full"
                            isLoading={loading}
                            loadingText="Logging in..."
                        >
                            Login
                        </Button>
                    </VStack>
                </form>

                <Text mt={4} textAlign="center">
                    Don't have an account?{' '}
                    <RouterLink to="/register" style={{ color: '#2F855A', fontWeight: 500 }}>
                        Create one
                    </RouterLink>
                </Text>
            </Box>
        </Container>
    );
}

export default LoginPage;