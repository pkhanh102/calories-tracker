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
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const mutedText = useColorModeValue("gray.500", "gray.400");

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

  const handleUpdateLog = async (log) => {
    if (!editingAmount || isNaN(editingAmount)) {
      alert("Please enter a valid number.");
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE}/logs/${log.id}`, {
        consumed_amount: Number(editingAmount),
        meal_type: log.meal_type,
        date: date,
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
    <Container maxW="4xl" py={8} minH="100vh">
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
          <Box mb={10} p={[4, 6]} borderWidth="1px" borderRadius="md" bg={bgCard} borderColor={borderColor} shadow="sm">
            <Heading as="h3" size="md" mb={4}>Nutrition Summary</Heading>
            <SimpleGrid columns={[1, 2]} spacing={4}>
              {[
                { label: "🔥 Calories", value: summary.totals.calories, goal: summary.goals.calories_goal, unit: "kcal" },
                { label: "🍗 Protein", value: summary.totals.protein, goal: summary.goals.protein_goal_g, unit: "g" },
                { label: "🍞 Carbs", value: summary.totals.carbs, goal: summary.goals.carb_goal_g, unit: "g" },
                { label: "🥑 Fats", value: summary.totals.fats, goal: summary.goals.fat_goal_g, unit: "g" }
              ].map((item, idx) => {
                const percent = Math.min((item.value / item.goal) * 100, 100);
                return (
                  <Box key={idx}>
                    <Flex justify="space-between" mb={1}>
                      <Text fontWeight="medium">{item.label}</Text>
                      <Text fontSize="sm">{item.value} / {item.goal} {item.unit}</Text>
                    </Flex>
                    <Box h={2} borderRadius="md" bg="gray.300">
                      <Box h={2} borderRadius="md" bg="green.400" w={`${percent}%`} transition="width 0.3s" />
                    </Box>
                  </Box>
                );
              })}
            </SimpleGrid>
          </Box>

          {/* Meal Logs */}
          <Box>
            <Heading as="h3" size="md" mb={6}>Logged Foods</Heading>
            {summary?.by_meal ? (
              meals.map(meal => (
                <Box key={meal} mb={8}>
                  <Flex align="center" mb={3}>
                    <Heading as="h4" size="sm" color="green.500" textTransform="capitalize">{meal}</Heading>
                  </Flex>

                  {summary.by_meal[meal] && summary.by_meal[meal].length > 0 ? (
                    <Stack spacing={3}>
                      {summary.by_meal[meal].map(item => (
                        <Box
                          key={item.id}
                          p={[3, 4]}
                          borderWidth="1px"
                          borderRadius="md"
                          bg={bgCard}
                          borderColor={borderColor}
                          shadow="sm"
                          transition="all 0.2s"
                          _hover={{ shadow: "md", transform: "translateY(-2px)" }}
                        >
                          <Flex justify="space-between" align="center" flexWrap="wrap">
                            <Box>
                              <Text fontWeight="semibold" fontSize="md">
                                {item.name} - {item.consumed_amount}{item.unit}
                              </Text>
                              <SimpleGrid columns={[2, null, 4]} spacing={[2, 3]} mt={2} fontSize="sm" color={textColor}>
                                <Box>
                                  <Text fontWeight="medium">🔥 Calories</Text>
                                  <Text>{item.calculated_calories} kcal</Text>
                                </Box>
                                <Box>
                                  <Text fontWeight="medium">🍗 Protein</Text>
                                  <Text>{item.calculated_protein}g</Text>
                                </Box>
                                <Box>
                                  <Text fontWeight="medium">🍞 Carbs</Text>
                                  <Text>{item.calculated_carbs}g</Text>
                                </Box>
                                <Box>
                                  <Text fontWeight="medium">🥑 Fats</Text>
                                  <Text>{item.calculated_fats}g</Text>
                                </Box>
                              </SimpleGrid>
                            </Box>
                            {editingLogId === item.id ? (
                              <Flex gap={2} align="center" mt={3}>
                                <Input
                                  type="number"
                                  size="sm"
                                  width="80px"
                                  value={editingAmount}
                                  onChange={(e) => setEditingAmount(e.target.value)}
                                />
                                <Button size="sm" colorScheme="green" onClick={() => handleUpdateLog(item)}>Save</Button>
                                <Button size="sm" variant="ghost" onClick={cancelEdit}>Cancel</Button>
                              </Flex>
                            ) : (
                              <Flex gap={3} mt={3}>
                                <Button size="sm" variant="link" colorScheme="blue" onClick={() => startEdit(item)}>Edit</Button>
                                <Button size="sm" variant="link" colorScheme="red" onClick={() => handleDeleteLog(item.id)}>Delete</Button>
                              </Flex>
                            )}
                          </Flex>
                        </Box>
                      ))}
                    </Stack>
                  ) : (
                    <Text color={mutedText}>No items logged.</Text>
                  )}
                </Box>
              ))
            ) : (
              <Text color={mutedText}>Loading log data...</Text>
            )}
          </Box>
        </>
      )}
    </Container>
  );
}


export default FoodLogHistoryPage;