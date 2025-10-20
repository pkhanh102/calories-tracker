import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE from "../apiConfig";
import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Heading,
  Input,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

function FoodLogHistoryPage() {
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');
  const [editingLogId, setEditingLogId] = useState(null);
  const [editingAmount, setEditingAmount] = useState('');

  const bgCard = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const borderColor = useColorModeValue("gray.300", "gray.600");

  const meals = ['breakfast', 'lunch', 'dinner', 'snack'];

  const fetchSummary = async (selectedDate) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE}/summary?date=${selectedDate}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSummary(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch summary data.');
    }
  };

  useEffect(() => {
    fetchSummary(date);
  }, [date]);

  const handleDeleteLog = async (logId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE}/logs/${logId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSummary(date); // refresh after deletion
    } catch (err) {
      console.error('Failed to delete log:', err);
      alert('Error deleting log.');
    }
  };

  const startEdit = (item) => {
    setEditingLogId(item.id);
    setEditingAmount(item.consumed_amount);
  };

  const cancelEdit = () => {
    setEditingLogId(null);
    setEditingAmount('');
  };

  const handleUpdateLog = async (logId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE}/logs/${logId}`, {
        consumed_amount: editingAmount
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      cancelEdit();
      fetchSummary(date);
    } catch (err) {
      console.error('Failed to update log:', err);
      alert('Error updating log.');
    }
  };

  return (
    <Container maxW="4xl" py={8}>
      <Flex justify="space-between" align="center" mb={6} wrap="wrap" gap={4}>
        <Heading size="lg" color="green.600">Food Log History</Heading>
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          maxW="200px"
        />
      </Flex>

      {error && <Text color="red.500">{error}</Text>}
      {!summary ? (
        <Flex align="center" justify="center" minH="200px">
          <Spinner size="lg" />
          <Text ml={4}>Loading summary...</Text>
        </Flex>
      ) : (
        <>
          {/* Daily Totals */}
          <Box bg={bgCard} p={5} borderRadius="md" shadow="sm" mb={6}>
            <Heading size="md" mb={4}>Daily Totals</Heading>
            <SimpleGrid columns={[1, 2]} spacing={4} fontSize="sm" color={textColor}>
              <Text>
                🔥 Calories: <strong>{summary.totals.calories}</strong>
                {summary.goals && ` / ${summary.goals.calories_goal} kcal`}
              </Text>
              <Text>
                🍗 Protein: <strong>{summary.totals.protein}g</strong>
                {summary.goals && ` / ${summary.goals.protein_goal_g}g`}
              </Text>
              <Text>
                🍞 Carbs: <strong>{summary.totals.carbs}g</strong>
                {summary.goals && ` / ${summary.goals.carb_goal_g}g`}
              </Text>
              <Text>
                🥑 Fats: <strong>{summary.totals.fats}g</strong>
                {summary.goals && ` / ${summary.goals.fat_goal_g}g`}
              </Text>
            </SimpleGrid>
          </Box>

          {/* Meal Logs */}
          {meals.map((meal) => (
            <Box key={meal} mb={6}>
              <Heading size="sm" mb={2} color="green.500">{meal.toUpperCase()}</Heading>
              <Divider mb={3} borderColor={borderColor} />

              {summary.by_meal[meal] && summary.by_meal[meal].length > 0 ? (
                <Stack spacing={4}>
                  {summary.by_meal[meal].map((item) => (
                    <Box
                      key={item.id}
                      p={4}
                      bg={bgCard}
                      borderWidth="1px"
                      borderRadius="md"
                      borderColor={borderColor}
                    >
                      <Flex justify="space-between" align="center" flexWrap="wrap">
                        <Box mb={[2, 0]}>
                          <Text fontWeight="semibold">{item.name}</Text>
                          <Text fontSize="sm" color={textColor}>
                            {item.calculated_calories} kcal | {item.calculated_protein}g P / {item.calculated_carbs}g C / {item.calculated_fats}g F
                          </Text>
                        </Box>

                        {editingLogId === item.id ? (
                          <Flex gap={2} align="center">
                            <Input
                              type="number"
                              size="sm"
                              width="80px"
                              value={editingAmount}
                              onChange={(e) => setEditingAmount(e.target.value)}
                            />
                            <Button size="sm" colorScheme="green" onClick={() => handleUpdateLog(item.id)}>Save</Button>
                            <Button size="sm" variant="ghost" onClick={cancelEdit}>Cancel</Button>
                          </Flex>
                        ) : (
                          <Flex gap={3}>
                            <Button size="sm" variant="link" colorScheme="blue" onClick={() => startEdit(item)}>Edit</Button>
                            <Button size="sm" variant="link" colorScheme="red" onClick={() => handleDeleteLog(item.id)}>Delete</Button>
                          </Flex>
                        )}
                      </Flex>
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Text fontSize="sm" color="gray.400">No entries.</Text>
              )}
            </Box>
          ))}
        </>
      )}
    </Container>
  );
}


export default FoodLogHistoryPage;