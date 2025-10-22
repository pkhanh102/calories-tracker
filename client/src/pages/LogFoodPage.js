import React, { useEffect, useState } from "react";
import axios from 'axios';
import {
    Box,
    Button,
    Container,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Select,
    Alert,
    AlertDescription,
    AlertIcon,
    VStack,
    useColorModeValue,
    Text,
    Spinner,
} from "@chakra-ui/react";
import API_BASE from "../apiConfig";

function LogFoodPage() {
    const [savedFoods, setSavedFoods] = useState([]);
    const [form, setForm] = useState({
        saved_food_id: '',
        consumed_amount: '',
        meal_type: 'breakfast',
        date: new Date().toISOString().split('T')[0]
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    const token = localStorage.getItem('token');

    // Fetch saved foods on mount
    useEffect(() => {
        const fetchFood = async () => {
            try {
                const res = await axios.get(`${API_BASE}/foods`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSavedFoods(res.data);
            } catch (err) {
                console.error('Error fetching foods:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchFood();
    }, [token]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        const errors = {};

        if (!form.saved_food_id) {
            errors.saved_food_id = "Please select a food item.";
        }

        const amount = parseFloat(form.consumed_amount);
        if (!amount || amount <= 0) {
            errors.consumed_amount = "Amount must be greater than 0.";
        }

        if (!form.meal_type) {
            errors.meal_type = "Please select a meal type.";
        }

        if (!form.date) {
            errors.date = "Please select a date.";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!validateForm()) return;

        setSubmitting(true);
        try {
            await axios.post(`${API_BASE}/logs`, form, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('✅ Food log created!');
            setForm({
                saved_food_id: '',
                consumed_amount: '',
                meal_type: 'breakfast',
                date: new Date().toISOString().split('T')[0]
            });
            setFormErrors({});
        } catch (err) {
            console.error('Log error:', err);
            setMessage('❌ Failed to log food. Try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Container maxW="md" py={10}>
            <Box
                borderWidth="1px"
                borderRadius="lg"
                p={8}
                boxShadow="md"
                bg={useColorModeValue("white", "gray.800")}
            >
                <Heading size="lg" mb={6} textAlign="center" color="green.600">
                    Log Food
                </Heading>

                {message && (
                    <Alert
                        status={message.startsWith("✅") ? "success" : "error"}
                        mb={4}
                        rounded="md"
                    >
                        <AlertIcon />
                        <AlertDescription>
                            {message.replace(/^✅\s*|^❌\s*/, '')}
                        </AlertDescription>
                    </Alert>
                )}

                {loading ? (
                    <Box textAlign="center">
                        <Spinner size="lg" color="green.500" />
                        <Text mt={3}>Loading saved foods...</Text>
                    </Box>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <VStack spacing={4}>
                            <FormControl isRequired isInvalid={!!formErrors.saved_food_id}>
                                <FormLabel>Food</FormLabel>
                                <Select
                                    name="saved_food_id"
                                    value={form.saved_food_id}
                                    onChange={handleChange}
                                    placeholder="Select Food"
                                >
                                    {savedFoods.map((food) => (
                                        <option key={food.id} value={food.id}>
                                            {food.name} ({food.base_amount}
                                            {food.unit})
                                        </option>
                                    ))}
                                </Select>
                                {formErrors.saved_food_id && (
                                    <Text fontSize="sm" color="red.500" mt={1}>{formErrors.saved_food_id}</Text>
                                )}
                            </FormControl>

                            <FormControl isRequired isInvalid={!!formErrors.consumed_amount}>
                                <FormLabel>Amount Consumed</FormLabel>
                                <Input
                                    name="consumed_amount"
                                    type="number"
                                    value={form.consumed_amount}
                                    onChange={handleChange}
                                    placeholder="e.g. 150"
                                />
                                {formErrors.consumed_amount && (
                                    <Text fontSize="sm" color="red.500" mt={1}>{formErrors.consumed_amount}</Text>
                                )}
                            </FormControl>    

                             <FormControl isRequired isInvalid={!!formErrors.meal_type}>
                                <FormLabel>Meal Type</FormLabel>
                                <Select
                                    name="meal_type"
                                    value={form.meal_type}
                                    onChange={handleChange}
                                >
                                    <option value="breakfast">Breakfast</option>
                                    <option value="lunch">Lunch</option>
                                    <option value="dinner">Dinner</option>
                                    <option value="snack">Snack</option>
                                </Select>
                                {formErrors.meal_type && (
                                    <Text fontSize="sm" color="red.500" mt={1}>{formErrors.meal_type}</Text>
                                )}
                            </FormControl> 

                            <FormControl isRequired isInvalid={!!formErrors.date}>
                                <FormLabel>Date</FormLabel>
                                <Input
                                    name="date"
                                    type="date"
                                    value={form.date}
                                    onChange={handleChange}
                                />
                                {formErrors.date && (
                                    <Text fontSize="sm" color="red.500" mt={1}>{formErrors.date}</Text>
                                )}
                            </FormControl>  

                            <Button
                                type="submit"
                                colorScheme="green"
                                width="full"
                                isLoading={submitting}
                                loadingText="Logging..."
                            >
                                Log Food
                            </Button>
                        </VStack>
                    </form>
                )}
            </Box>
        </Container>
    );
}

export default LogFoodPage