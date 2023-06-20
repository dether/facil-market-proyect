import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Category } from "../utils/interfaces";

const FeaturedCategory = () => {
  const categories = useSelector((state: RootState) => state.category.value);

  return (
    <>
      <h2 className="title-featured">Categorias destacadas</h2>
      <div className="container-featured">

        {categories.map(
          (category: Category, index: number) =>
            // Verificar si category.highlight es true
            category.highlight && (
              <div key={index} className="container-featuredcategory">
                <div key={index} className="image-featuredcategory">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="category-image"
                  />
                </div>
                <h2 className="category-name">{category.name}</h2>
              </div>
            )
        )}
      </div>
    </>
  );
};

export default FeaturedCategory;
