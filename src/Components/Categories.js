import React from 'react';
import '../Components/Categories.css'; // Add styles for category grid

const Categories = () => {
  const categories = [
    { name: "Women's", imgSrc: 'path_to_womens_image.jpg' },
    { name: "Accessories", imgSrc: 'path_to_accessories_image.jpg' },
    { name: "Men's", imgSrc: 'path_to_mens_image.jpg' },
  ];

  return (
    <section className="categories">
      <div className="category-grid">
        {categories.map((category, index) => (
          <div key={index} className="category-card">
            <img src={category.imgSrc} alt={category.name} />
            <div className="category-title">
              <h3>{category.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;
