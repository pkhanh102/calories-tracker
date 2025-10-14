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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage("");

        try {
            await axios.post(`${API_BASE}/logs`, {
                saved_food_id: form.saved_food_id,
                consumed_amount: form.consumed_amount,
                meal_type: form.meal_type,
                date: form.date
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('✅ Food log created!');
            setForm({
                saved_food_id: '',
                consumed_amount: '',
                meal_type: 'breakfast',
                date: new Date().toISOString().split('T')[0]
            });
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
                            <FormControl isRequired>
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
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel>Amount Consumed</FormLabel>
                                <Input
                                    name="consumed_amount"
                                    type="number"
                                    value={form.consumed_amount}
                                    onChange={handleChange}
                                    placeholder="e.g. 150"
                                />
                            </FormControl>    

                             <FormControl isRequired>
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
                            </FormControl> 

                            <FormControl isRequired>
                                <FormLabel>Date</FormLabel>
                                <Input
                                    name="date"
                                    type="date"
                                    value={form.date}
                                    onChange={handleChange}
                                />
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