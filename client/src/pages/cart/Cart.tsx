import { useEffect, useState } from "react";
import { RootState } from "../../redux/store";
import { useSelector, useDispatch } from "react-redux";
import { BuyProduct, Product } from "../../utils/interfaces";
import PaymentButton from "../../components/PaymentButton";
import { clearCart } from "../../redux/features/cartSlice";

// import { UpdateCart } from "../../services/cartServicer";
import CartEmpty from "./CartEmpty";
import CartItem from "./CartItem";

const Cart = () => {
	const dispatch = useDispatch();

	const cartItems = useSelector(
		(state: RootState) => state.cart.cartItems.products
	);
	const products = useSelector((state: RootState) => state.product.products);
	const [productsCart, setProductsCart] = useState<Product[]>([]);

	console.log(productsCart);

	//? logica de compra
	const handleTotalPrice = (cartItems: Array<BuyProduct>) => {
		const totalPrice = cartItems.reduce(
			(total, item) => total + item.price * item.quantity,
			0
		);

		return totalPrice;
	};

	const handleClearCart = () => {
		dispatch(clearCart());
	};
	useEffect(() => {
		const getProductsCart = () => {
			const tempProductsCart: Product[] = []; // Array temporal para almacenar los productos

			for (const cartItem of cartItems) {
				const productFound = products.find(
					(product) => product.id === cartItem.id
				);
				if (productFound) {
					tempProductsCart.push(productFound);
				}
			}

			setProductsCart(tempProductsCart);
		};

		getProductsCart();
	}, [cartItems, products]);
	// useEffect(() => {
	// 	// Cargar productos al backend cuando se accede a la página

	// 	const getProductsCart = () => {
	// 		let count = 0;
	// 		while (cartItems?.length !== count) {
	// 			const productFound = products.find(
	// 				(match) => match.id === cartItems[count].id
	// 			);
	// 			if (productFound) {
	// 				setProductsCart([...productsCart, productFound]);
	// 			}
	//       count++;
	// 		}
	// 	};
	// 	getProductsCart();
	// }, [cartItems, products]);

	return (
		<div>
			{cartItems.length === 0 ? (
				<CartEmpty />
			) : (
				<>
					<h1 className="cart-title">Carrito de compras</h1>
					<button onClick={handleClearCart}>Limpiar carrito</button>
					<div className="cards-container">
						{productsCart.map((item: Product, index: number) => (
							<CartItem key={index} item={item} index={index} />
						))}
					</div>

					<div className="cartTotal-container">
						<h2 className="cart__total">
							{`Precio Final: ${handleTotalPrice(cartItems)}`}
						</h2>
					</div>
					<PaymentButton {...cartItems} />
				</>
			)}
		</div>
	);
};

export default Cart;
