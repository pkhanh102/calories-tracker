import React, { useState } from 'react';
import {
    Box,
    Button,
    Container,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    Heading,
    Text,
    Alert,
    AlertIcon,
    AlertDescription,
    VStack,
    useColorModeValue,
    Image,
    IconButton
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import API_BASE from "../apiConfig";
import MacroMateIconBRM from '../assests/MacroMateIconBRM.png';

function RegisterPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
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
        setMessage('');

        if (formData.password !== formData.confirmPassword) {
            setMessage('❌ Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            await axios.post(`${API_BASE}/auth/register`, {
                email: formData.email,
                password: formData.password
            });
            setMessage('✅ Registration successful! You can now log in.');
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            console.error(err);
            setMessage('❌ Registration failed. Email may already be in use.');
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
                    mb={4}
                />

                <Heading size="lg" mb={6} textAlign="center" color="green.600">
                    Create Your MacroMate Account
                </Heading>

                {message && (
                    <Alert
                        status={message.includes('✅') ? 'success' : 'error'}
                        mb={4}
                        rounded="md"
                    >
                        <AlertIcon />
                        <AlertDescription>{message}</AlertDescription>
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <VStack spacing={4}>
                        <FormControl isRequired>
                            <FormLabel>Email</FormLabel>
                            <Input
                                name='email'
                                type='email'
                                value={formData.email}
                                onChange={handleChange}
                                placeholder='you@example.com'
                            />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Password</FormLabel>
                            <InputGroup>
                                <Input
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="********"
                                />
                                <InputRightElement>
                                    <IconButton
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowPassword(!showPassword)}
                                        icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    />
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Confirm Password</FormLabel>
                            <InputGroup>
                                <Input
                                    name="confirmPassword"
                                    type={showConfirm ? 'text' : 'password'}
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="********"
                                />
                                <InputRightElement>
                                    <IconButton
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowConfirm(!showConfirm)}
                                        icon={showConfirm ? <ViewOffIcon /> : <ViewIcon />}
                                        aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                                    />
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>

                        <Button
                            type='submit'
                            colorScheme='green'
                            width="full"
                            isLoading={loading}
                            loadingText="Registering..."
                        >
                            Register
                        </Button>
                    </VStack>
                </form>

                <Text mt={4} textAlign="center">
                    Already have an account?{' '}
                    <RouterLink to="/login" style={{ color: '#2F855A', fontWeight: 500 }}>
                        Login here
                    </RouterLink>
                </Text>
            </Box>
        </Container>
    );
}

export default RegisterPage;
