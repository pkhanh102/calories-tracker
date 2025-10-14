import React, { useEffect, useState } from "react";
import axios from 'axios';
import {
    Box,
    Button,
    Container,
    FormControl,
    FormLabel,
    Input,
    Heading,
    Alert,
    AlertIcon,
    AlertDescription,
    VStack,
    useColorModeValue
} from '@chakra-ui/react';
import API_BASE from "../apiConfig";

function GoalPage() {
    const [goals, setGoals] = useState({
        calories_goal: '',
        protein_percent: '',
        carb_percent: '',
        fat_percent: ''
    });

    const [message, setMessage] = useState('');

    // Fetch existing goal
    useEffect(() => {
        const fetchGoals = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${API_BASE}/goals`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setGoals(res.data)
            } catch (err) {
                console.error(err);
                setMessage('⚠️ Failed to fetch goals');
            }
        };

        fetchGoals();
    }, []);


    const handleChange = (e) => {
        setGoals((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate macro %
        const totalPercent = 
            Number(goals.protein_percent) +
            Number(goals.carb_percent) +
            Number(goals.fat_percent);
        if (totalPercent !== 100) {
            setMessage('⚠️ Macronutrient percentages must total 100%');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_BASE}/goals`, {
                calories_goal: Number(goals.calories_goal),
                protein_percent: Number(goals.protein_percent),
                carb_percent: Number(goals.carb_percent),
                fat_percent: Number(goals.fat_percent),
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('✅ Goals updated successfully!');
        } catch (err) {
            console.error(err);
            setMessage('❌ Failed to update goals');
        }
    };

    return (
        <Container maxW="md" py={12}>
            <Box
                borderWidth="1px"
                borderRadius="lg"
                p={8}
                boxShadow="md"
                bg={useColorModeValue('white', 'gray.800')}
                textAlign="center"
            >
                <Heading size="lg" mb={6} color="green.600">
                    Set Nutrition Goals
                </Heading>

                {message && (
                    <Alert
                        status={message.startsWith("✅") ? "success" : "error"}
                        mb={6}
                        rounded="md"
                    >
                        <AlertIcon />
                        <AlertDescription>
                            {message.replace(/^✅\s*|^❌\s*|^⚠️\s*/, '')}
                        </AlertDescription>
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <VStack spacing={4}>
                        <FormControl isRequired>
                            <FormLabel>Daily Calories</FormLabel>
                            <Input
                                name="calories_goal"
                                type="number"
                                value={goals.calories_goal}
                                onChange={handleChange}
                                placeholder="e.g., 2200"
                            />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Protein %</FormLabel>
                            <Input
                                name="protein_percent"
                                type="number"
                                value={goals.protein_percent}
                                onChange={handleChange}
                                placeholder="e.g., 30"
                            />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Carb %</FormLabel>
                            <Input
                                name="carb_percent"
                                type="number"
                                value={goals.carb_percent}
                                onChange={handleChange}
                                placeholder="e.g., 40"
                            />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Fat %</FormLabel>
                            <Input
                                name="fat_percent"
                                type="number"
                                value={goals.fat_percent}
                                onChange={handleChange}
                                placeholder="e.g., 30"
                            />
                        </FormControl>

                        <Button
                            type="submit"
                            colorScheme="green"
                            width="full"
                            mt={2}
                        >
                            Update Goals
                        </Button>
                    </VStack>
                </form>
            </Box>
        </Container>
    );
}


export default GoalPage;