// Plan: For the list filtering we'll use ingredients and code it.
// We will utilize the api's search query to get new recipes.
// Essentially we have two search bars, format as we please.
// We will also get the recipe card because it looks nice. 

import { useState, useEffect } from 'react';
import './App.css';

const API_KEY = import.meta.env.VITE_APP_API_KEY;

function App() {
  const [recipes, setRecipes] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  const [summaryStats, setSummaryStats] = useState({
    totalRecipes: 0,
    avgReadyInMinutes: 0,
    avgHealthScore: 0,
    vegetarianCount: 0,
  });

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch(`https://api.spoonacular.com/recipes/random?number=10&apiKey=${API_KEY}`);
        const data = await response.json();
        console.log('API Response:', data); // Log the entire response

        if (data.recipes) {
          setRecipes(data.recipes);
          setFilteredResults(data.recipes);
          calculateSummaryStats(data.recipes);
        } else {
          console.error('No recipes found in the response:', data);
        }
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    fetchRecipes();
  }, []);

  const calculateSummaryStats = (data) => {
    const totalRecipes = data.length;
    const avgReadyInMinutes = data.reduce((acc, recipe) => acc + (recipe.readyInMinutes || 0), 0) / totalRecipes;
    const avgHealthScore = data.reduce((acc, recipe) => acc + (recipe.healthScore || 0), 0) / totalRecipes;
    const vegetarianCount = data.filter(recipe => recipe.vegetarian).length;

    setSummaryStats({
      totalRecipes,
      avgReadyInMinutes,
      avgHealthScore,
      vegetarianCount,
    });
  };

  const searchItems = (searchValue) => {
    setSearchInput(searchValue);
    if (searchValue !== '') {
      const filteredData = recipes.filter((recipe) =>
        recipe.title.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredResults(filteredData);
    } else {
      setFilteredResults(recipes);
    }
  };

  const filterByTag = (tag) => {
    const filteredData = recipes.filter((recipe) =>
      recipe.dishTypes.includes(tag)
    );
    setFilteredResults(filteredData);
  };

  return (
    <div className="App">
      <h1>Recipe Dashboard</h1>
      <div className="summary-stats">
        <p>Total Recipes: {summaryStats.totalRecipes}</p>
        <p>Average Ready In Minutes: {summaryStats.avgReadyInMinutes.toFixed(2)}</p>
        <p>Average Health Score: {summaryStats.avgHealthScore.toFixed(2)}</p>
        <p>Vegetarian Recipes: {summaryStats.vegetarianCount}</p>
      </div>
      <div className="search-filter">
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchInput}
          onChange={(e) => searchItems(e.target.value)}
        />
        <button onClick={() => filterByTag('vegetarian')}>Vegetarian</button>
        <button onClick={() => filterByTag('dessert')}>Dessert</button>
      </div>
      <div className="recipe-list">
        {filteredResults.map((recipe) => (
          <div key={recipe.id} className="recipe-card">
            <h2>{recipe.title}</h2>
            <p>Ready In Minutes: {recipe.readyInMinutes || 'N/A'}</p>
            <p>Health Score: {recipe.healthScore || 'N/A'}</p>
            <p>Vegetarian: {recipe.vegetarian ? 'Yes' : 'No'}</p>
            <img src={recipe.image} alt={recipe.title} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
