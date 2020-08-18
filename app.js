const searchInput = document.getElementById('search');
const searchBtn = document.getElementById('submit');
const randomBtn = document.getElementById('random');
const mealsDiv = document.getElementById('meals');
const meal = document.querySelector('.meal');
const messageDiv = document.querySelector('.message');
const resultHeading = document.getElementById('result-heading');
const singleMealElement = document.getElementById('single-meal');
const viewInfoBtn = document.querySelector('.btn-view-info');

searchBtn.addEventListener('submit', searchForMeals);
randomBtn.addEventListener('click', showRandomMeal);

function searchForMeals(e) {
	e.preventDefault();

	singleMealElement.innerHTML = '';

	const word = searchInput.value;
	if (word.trim()) {
		fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${word}`).then((res) => res.json()).then((data) => {
			console.log(data);

			if (data.meals === null) {
				resultHeading.innerHTML = `<p>There are no search results.Try again!</p>`;
			} else {
				mealsDiv.innerHTML = data.meals
					.map(
						(meal) => `
                 <div class ="meal"> 
                  <img src ="${meal.strMealThumb}"/>
                  <div class = "meal-info" data-meal =${meal.idMeal}> 
				  <h3>${meal.strMeal}</h3>
				  <h3>Click & View Info Below <h3>
				  </div>
                 </div> `
					)
					.join('');
			}
		});
		searchInput.value = '';
	} else {
		messageDiv.classList.add('show');
		setTimeout(() => messageDiv.classList.remove('show'), 2000);
	}
}

mealsDiv.addEventListener('click', (e) => {
	const mealInfo = e.path.find((item) => {
		if (item.classList) {
			return item.classList.contains('meal-info');
		} else {
			return false;
		}
	});

	if (mealInfo) {
		const mealID = mealInfo.getAttribute('data-meal');
		getMealById(mealID);
	}

	console.log(123);
});

function getMealById(id) {
	fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`).then((res) => res.json()).then((data) => {
		const meal = data.meals[0];
		addMealToDOM(meal);
		console.log(meal);
	});
}

function addMealToDOM(meal) {
	const ingredients = [];
	for (let i = 1; i < 20; i++) {
		if (meal[`strIngredient${i}`]) {
			ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
		} else {
			break;
		}
	}

	singleMealElement.innerHTML = `
	<div class="one-meal">
     <h1>${meal.strMeal} </h1>
	 <img src = "${meal.strMealThumb}"/>
	 </div>
     <div class= "single-meal-info"> 
      ${meal.strCategory ? `<h3>${meal.strCategory} </h3>` : ''}
      ${meal.strArea ? `<h4>${meal.strArea} </h4>` : ''}
    
     
      <p> ${meal.strInstructions}</p>
      <h2> Ingredients </h2>
      <ul>
      ${ingredients.map((ing) => `<li>${ing} </li>`).join('')}
      </ul> 
     <a href = "${meal.strYoutube}" target = "_blank" class = "link-youtube">View How to Cook on Youtube </a>
	</div>`;
}

function showRandomMeal(e) {
	e.preventDefault();

	//clear meals and headings
	mealsDiv.innerHTML = '';
	resultHeading.innerHTML = '';

	fetch(`https://www.themealdb.com/api/json/v1/1/random.php`).then((res) => res.json()).then((data) => {
		const meal = data.meals[0];
		addMealToDOM(meal);
	});
}

setTimeout(() => {
	document.querySelector('.nav').style.backgroundColor = '#000';
}, 2000);
