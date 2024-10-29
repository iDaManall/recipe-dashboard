import React, { Component, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import '../RecipeDetail.css';

const API_KEY = import.meta.env.VITE_APP_API_KEY;

const RecipeDetail = () => {
    const { id } = useParams();
    const [recipeDetail, setRecipeDetail] = useState(null);
    const [card, setCard] = useState(null);

    useEffect(() => {
        const fetchRecipeDetail = async () => {
          try {
            const response = await fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`);
            const data = await response.json();
            setRecipeDetail(data);
            console.log('Recipe Detail:', data); // Log the recipe detail data
    
            // Fetch recipe card only if the number of ingredients is 14 or fewer
            if (data.extendedIngredients.length <= 14) {
              fetchRecipeCard(id);
            } else {
              console.log('Recipe has too many ingredients for a card.');
            }
          } catch (error) {
            console.error('Error fetching recipe detail:', error);
          }
        };
    
        const fetchRecipeCard = async (recipeId) => {
          try {
            const cardUrl = `https://api.spoonacular.com/recipes/${recipeId}/card?apiKey=${API_KEY}`;
            console.log('Fetching Recipe Card from URL:', cardUrl); // Log the full URL
            const cardResponse = await fetch(cardUrl);
            const cardData = await cardResponse.json();
            setCard(cardData.url);
            console.log('Recipe Card:', cardData); // Log the recipe card data
          } catch (error) {
            console.error('Error fetching recipe card:', error);
          }
        };
    
        fetchRecipeDetail();
    }, [id]);

    if (!recipeDetail) {
        return <div>Loading...</div>;
    }

    // Split instructions into sentences
    const instructions = recipeDetail.instructions.split('.').filter(sentence => sentence.trim() !== '');

    return (
        <div className="recipe-detail">
            <h1>{recipeDetail.title}</h1>
            <img src={recipeDetail.image} alt={recipeDetail.title} />
            <p dangerouslySetInnerHTML={{ __html: recipeDetail.summary }}></p>
            <h2>Ingredients</h2>
            <ul>
                {recipeDetail.extendedIngredients.map((ingredient) => (
                <li key={ingredient.id}>
                    {ingredient.original}
                </li>
                ))}
            </ul>
            <h2>Instructions</h2>
            <div className="instructions">
                {instructions.map((sentence, index) => (
                <p key={index}>{sentence.trim()}.</p>
                ))}
            </div>
            <h2>Additional Information</h2>
            <div className="additional-info">
                <p>Servings: {recipeDetail.servings}</p>
                <p>Price Per Serving: ${recipeDetail.pricePerServing.toFixed(2)}</p>
                <p>Source: <a href={recipeDetail.sourceUrl} target="_blank" rel="noopener noreferrer" className="source-link">{recipeDetail.sourceName}</a></p>
            </div>
            {card ? <img src={card} alt="Recipe Card" /> : <p>{'Recipe card cannot be generated.'}</p>}
        </div>
    );
};

export default RecipeDetail;