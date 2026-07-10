// menuData.js
// All dish/combo/thali data lives here, separated from the component logic.
// Edit or expand this file to change the menu without touching OrdersOnline.jsx.

export const staticCategories = [
  { name: "Thali", count: 5 },
  { name: "Pocket Friendly Combos", count: 7 },
  { name: "Snacks", count: 7 },
  { name: "Starters", count: 21 },
  { name: "North Indian Main Course", count: 16 },
  { name: "Chinese Main course", count: 13 },
  { name: "Italian Pizza and Pasta", count: 4 },
  { name: "Rice", count: 3 },
  { name: "Breads", count: 7 },
  { name: "Boxes", count: 1 },
  { name: "Drinks (Beverages)", count: 20 }
];

// Thali varieties (veg). mealType marks afternoon / dinner / both.
export const thaliItems = [
  {
    id: "thali-1",
    name: "Regular Veg Thali",
    price: 140,
    priceText: "₹140",
    desc: "Dal, 2 sabzi, 4 roti, rice, salad, papad",
    veg: true,
    category: "Thali",
    mealType: "both"
  },
  {
    id: "thali-2",
    name: "Special Veg Thali",
    price: 190,
    priceText: "₹190",
    desc: "Paneer sabzi, dal makhani, 4 roti, jeera rice, sweet, salad",
    veg: true,
    category: "Thali",
    mealType: "dinner"
  },
  {
    id: "thali-3",
    name: "Mini Thali",
    price: 90,
    priceText: "₹90",
    desc: "Dal, 1 sabzi, 3 roti, rice — light lunch portion",
    veg: true,
    category: "Thali",
    mealType: "afternoon"
  },
  {
    id: "thali-4",
    name: "Malwa Special Thali",
    price: 180,
    priceText: "₹180",
    desc: "Dal bafla, sabzi, ladoo, chutney, rice",
    veg: true,
    category: "Thali",
    mealType: "both"
  },
  {
    id: "thali-5",
    name: "Jain Thali (No Onion Garlic)",
    price: 130,
    priceText: "₹130",
    desc: "Dal, 2 sabzi, 4 roti, rice — pure Jain",
    veg: true,
    category: "Thali",
    mealType: "both"
  }
];

export const staticCombos = [
  {
    id: 1,
    name: "Dal Makhani Rice Bowl",
    price: 279,
    priceText: "₹279",
    desc: "Dal Makhani+Jeera Rice+Masala Onions",
    veg: true
  },
  {
    id: 2,
    name: "Veg Hakka Noodles with Chilli Paneer",
    price: 349,
    priceText: "₹349",
    desc: "Noodles tossed with a savory blend of soy sauce and chilli sauce, while ...",
    veg: true
  },
  {
    id: 3,
    name: "Veg Hakka Noodles with Manchurian",
    price: 299,
    priceText: "₹299",
    desc: "A classic Chinese inspired veg dish featuring stir fried noodles and crispy manchurian ...",
    veg: true
  },
  {
    id: 4,
    name: "Veg Fried Rice with Chilli Paneer",
    price: 349,
    priceText: "₹349",
    desc: "A popular veg dish that combines the savory goodness of fried rice with ...",
    veg: true
  },
  {
    id: 5,
    name: "Veg Fried Rice with Manchurian",
    price: 299,
    priceText: "₹299",
    desc: "The fried rice is typically made with vegetables like carrots, peas, corn and ...",
    veg: true
  },
  {
    id: 6,
    name: "Aloo Tikki Burger Combo",
    price: 249,
    priceText: "₹249",
    desc: "Aloo Tikki Burger+Fries+Cold Coffee",
    veg: true
  },
  {
    id: 7,
    name: "Italian Feast Combo",
    price: 399,
    priceText: "₹399",
    desc: "Pasta+Garlic Bread+Cold Drink",
    veg: true
  }
];

// -------------------------------------------------------
// Snacks (7 items)
export const snacksItems = [
  {
    id: "snack-1",
    name: "Samosa (2 pcs)",
    price: 60,
    priceText: "₹60",
    desc: "Crispy fried pastry stuffed with spiced potatoes and peas",
    veg: true,
    category: "Snacks"
  },
  {
    id: "snack-2",
    name: "Kachori (2 pcs)",
    price: 70,
    priceText: "₹70",
    desc: "Deep-fried flaky bread filled with moong dal and spices",
    veg: true,
    category: "Snacks"
  },
  {
    id: "snack-3",
    name: "Aloo Tikki (3 pcs)",
    price: 80,
    priceText: "₹80",
    desc: "Shallow-fried potato patties served with chutneys",
    veg: true,
    category: "Snacks"
  },
  {
    id: "snack-4",
    name: "Bread Pakora (2 pcs)",
    price: 70,
    priceText: "₹70",
    desc: "Gram flour battered bread slices stuffed with potato masala",
    veg: true,
    category: "Snacks"
  },
  {
    id: "snack-5",
    name: "Paneer Pakora (6 pcs)",
    price: 120,
    priceText: "₹120",
    desc: "Chunks of paneer dipped in spiced besan batter and fried golden",
    veg: true,
    category: "Snacks"
  },
  {
    id: "snack-6",
    name: "Veg Cutlet (2 pcs)",
    price: 85,
    priceText: "₹85",
    desc: "Mixed vegetable patties coated in breadcrumbs and shallow fried",
    veg: true,
    category: "Snacks"
  },
  {
    id: "snack-7",
    name: "Dahi Vada",
    price: 90,
    priceText: "₹90",
    desc: "Lentil dumplings soaked in creamy yogurt, topped with chutneys",
    veg: true,
    category: "Snacks"
  }
];

// -------------------------------------------------------
// Starters (21 items)
export const startersItems = [
  {
    id: "start-1",
    name: "Paneer Tikka",
    price: 190,
    priceText: "₹190",
    desc: "Marinated paneer cubes, bell peppers and onions cooked in tandoor",
    veg: true,
    category: "Starters"
  },
  {
    id: "start-2",
    name: "Hara Bhara Kabab",
    price: 150,
    priceText: "₹150",
    desc: "Spinach and peas patties, mildly spiced, pan-fried",
    veg: true,
    category: "Starters"
  },
  {
    id: "start-3",
    name: "Veg Seekh Kabab",
    price: 160,
    priceText: "₹160",
    desc: "Minced veg and paneer skewers grilled in tandoor",
    veg: true,
    category: "Starters"
  },
  {
    id: "start-4",
    name: "Mushroom Tikka",
    price: 170,
    priceText: "₹170",
    desc: "Marinated button mushrooms char-grilled to perfection",
    veg: true,
    category: "Starters"
  },
  {
    id: "start-5",
    name: "Tandoori Aloo",
    price: 140,
    priceText: "₹140",
    desc: "Potatoes marinated in spiced yogurt, roasted in tandoor",
    veg: true,
    category: "Starters"
  },
  {
    id: "start-6",
    name: "Gobi Manchurian (Dry)",
    price: 130,
    priceText: "₹130",
    desc: "Crispy cauliflower florets tossed in Indo-Chinese manchurian sauce",
    veg: true,
    category: "Starters"
  },
  {
    id: "start-7",
    name: "Chilli Paneer (Dry)",
    price: 190,
    priceText: "₹190",
    desc: "Cubes of paneer wok-tossed with capsicum, onions and soy-chilli sauce",
    veg: true,
    category: "Starters"
  },
  {
    id: "start-8",
    name: "Spring Rolls (4 pcs)",
    price: 140,
    priceText: "₹140",
    desc: "Crispy fried rolls stuffed with veggies and glass noodles",
    veg: true,
    category: "Starters"
  },
  {
    id: "start-9",
    name: "Honey Chilli Potato",
    price: 130,
    priceText: "₹130",
    desc: "Crispy fried potato fingers glazed with honey chilli sauce",
    veg: true,
    category: "Starters"
  },
  {
    id: "start-10",
    name: "Crispy Corn",
    price: 150,
    priceText: "₹150",
    desc: "American corn kernels dusted with spices and fried until crunchy",
    veg: true,
    category: "Starters"
  },
  {
    id: "start-11",
    name: "Paneer 65",
    price: 180,
    priceText: "₹180",
    desc: "Spicy, crispy fried paneer with curry leaves and yoghurt marinade",
    veg: true,
    category: "Starters"
  },
  {
    id: "start-12",
    name: "Veg Manchow Soup",
    price: 100,
    priceText: "₹100",
    desc: "Thick, spicy soup with vegetables and crispy noodles",
    veg: true,
    category: "Starters"
  },
  {
    id: "start-13",
    name: "Tomato Soup",
    price: 90,
    priceText: "₹90",
    desc: "Creamy tomato soup with croutons",
    veg: true,
    category: "Starters"
  },
  {
    id: "start-14",
    name: "Sweet Corn Soup",
    price: 100,
    priceText: "₹100",
    desc: "Velvety sweet corn soup with veggies",
    veg: true,
    category: "Starters"
  },
  {
    id: "start-15",
    name: "Veg Salt & Pepper",
    price: 140,
    priceText: "₹140",
    desc: "Assorted vegetables tossed with salt, pepper and garlic",
    veg: true,
    category: "Starters"
  },
  {
    id: "start-16",
    name: "Paneer Satay",
    price: 200,
    priceText: "₹200",
    desc: "Paneer skewers with a mildly spiced peanut sauce",
    veg: true,
    category: "Starters"
  },
  {
    id: "start-17",
    name: "Dragon Potato",
    price: 160,
    priceText: "₹160",
    desc: "Potato wedges tossed in spicy sweet garlic sauce, topped with sesame",
    veg: true,
    category: "Starters"
  },
  {
    id: "start-18",
    name: "Cheese Corn Balls",
    price: 170,
    priceText: "₹170",
    desc: "Melted cheese and corn filling, breaded and fried",
    veg: true,
    category: "Starters"
  },
  {
    id: "start-19",
    name: "Veg Kebab Platter",
    price: 260,
    priceText: "₹260",
    desc: "Assortment of hara bhara, seekh and paneer tikka kebabs",
    veg: true,
    category: "Starters"
  },
  {
    id: "start-20",
    name: "Nachos with Cheese Sauce",
    price: 180,
    priceText: "₹180",
    desc: "Crispy corn nachos loaded with cheese sauce, salsa and beans",
    veg: true,
    category: "Starters"
  },
  {
    id: "start-21",
    name: "Dahi ke Sholay",
    price: 160,
    priceText: "₹160",
    desc: "Hung curd spiced and wrapped in bread, deep-fried",
    veg: true,
    category: "Starters"
  }
];

// -------------------------------------------------------
// North Indian Main Course (16 items)
export const northIndianItems = [
  {
    id: "ni-1",
    name: "Dal Makhani",
    price: 160,
    priceText: "₹160",
    desc: "Slow-cooked black lentils in rich tomato-cream gravy",
    veg: true,
    category: "North Indian Main Course"
  },
  {
    id: "ni-2",
    name: "Shahi Paneer",
    price: 200,
    priceText: "₹200",
    desc: "Cottage cheese cubes in a creamy, nutty gravy",
    veg: true,
    category: "North Indian Main Course"
  },
  {
    id: "ni-3",
    name: "Palak Paneer",
    price: 180,
    priceText: "₹180",
    desc: "Fresh spinach puree with soft paneer cubes",
    veg: true,
    category: "North Indian Main Course"
  },
  {
    id: "ni-4",
    name: "Kadai Paneer",
    price: 200,
    priceText: "₹200",
    desc: "Paneer cooked with bell peppers, onions and kadai masala",
    veg: true,
    category: "North Indian Main Course"
  },
  {
    id: "ni-5",
    name: "Matar Paneer",
    price: 180,
    priceText: "₹180",
    desc: "Green peas and paneer in a tomato-onion gravy",
    veg: true,
    category: "North Indian Main Course"
  },
  {
    id: "ni-6",
    name: "Paneer Butter Masala",
    price: 210,
    priceText: "₹210",
    desc: "Paneer in a rich buttery tomato-cream sauce",
    veg: true,
    category: "North Indian Main Course"
  },
  {
    id: "ni-7",
    name: "Aloo Gobi",
    price: 150,
    priceText: "₹150",
    desc: "Potatoes and cauliflower cooked with cumin and spices",
    veg: true,
    category: "North Indian Main Course"
  },
  {
    id: "ni-8",
    name: "Malai Kofta",
    price: 190,
    priceText: "₹190",
    desc: "Fried paneer-potato dumplings in a silky cream sauce",
    veg: true,
    category: "North Indian Main Course"
  },
  {
    id: "ni-9",
    name: "Chana Masala",
    price: 140,
    priceText: "₹140",
    desc: "Spicy chickpea curry with onions and tomatoes",
    veg: true,
    category: "North Indian Main Course"
  },
  {
    id: "ni-10",
    name: "Rajma Masala",
    price: 150,
    priceText: "₹150",
    desc: "Red kidney beans simmered in a thick onion-tomato gravy",
    veg: true,
    category: "North Indian Main Course"
  },
  {
    id: "ni-11",
    name: "Veg Kolhapuri",
    price: 170,
    priceText: "₹170",
    desc: "Mixed vegetables in a fiery Kolhapuri masala",
    veg: true,
    category: "North Indian Main Course"
  },
  {
    id: "ni-12",
    name: "Mushroom Masala",
    price: 180,
    priceText: "₹180",
    desc: "Button mushrooms cooked in a spiced onion-tomato base",
    veg: true,
    category: "North Indian Main Course"
  },
  {
    id: "ni-13",
    name: "Baingan Bharta",
    price: 160,
    priceText: "₹160",
    desc: "Smoked eggplant mashed and cooked with onions and spices",
    veg: true,
    category: "North Indian Main Course"
  },
  {
    id: "ni-14",
    name: "Bhindi Masala",
    price: 150,
    priceText: "₹150",
    desc: "Okra sautéed with onions and dry spices",
    veg: true,
    category: "North Indian Main Course"
  },
  {
    id: "ni-15",
    name: "Mix Veg Curry",
    price: 160,
    priceText: "₹160",
    desc: "Seasonal vegetables in a medium-spiced gravy",
    veg: true,
    category: "North Indian Main Course"
  },
  {
    id: "ni-16",
    name: "Dum Aloo",
    price: 170,
    priceText: "₹170",
    desc: "Baby potatoes in a rich yoghurt and spice gravy",
    veg: true,
    category: "North Indian Main Course"
  }
];

// -------------------------------------------------------
// Chinese Main course (13 items)
export const chineseItems = [
  {
    id: "ch-1",
    name: "Veg Manchurian Gravy",
    price: 150,
    priceText: "₹150",
    desc: "Fried vegetable balls in a tangy soy-based gravy",
    veg: true,
    category: "Chinese Main course"
  },
  {
    id: "ch-2",
    name: "Chilli Paneer Gravy",
    price: 190,
    priceText: "₹190",
    desc: "Soft paneer cubes tossed with peppers in chilli soy sauce",
    veg: true,
    category: "Chinese Main course"
  },
  {
    id: "ch-3",
    name: "Hakka Noodles",
    price: 140,
    priceText: "₹140",
    desc: "Stir-fried noodles with veggies, soy and vinegar",
    veg: true,
    category: "Chinese Main course"
  },
  {
    id: "ch-4",
    name: "Veg Fried Rice",
    price: 140,
    priceText: "₹140",
    desc: "Wok-fried rice with finely chopped vegetables",
    veg: true,
    category: "Chinese Main course"
  },
  {
    id: "ch-5",
    name: "Schezwan Fried Rice",
    price: 160,
    priceText: "₹160",
    desc: "Spicy fried rice tossed with schezwan sauce and veggies",
    veg: true,
    category: "Chinese Main course"
  },
  {
    id: "ch-6",
    name: "Chowmein",
    price: 130,
    priceText: "₹130",
    desc: "Pan-fried noodles with cabbage, carrots and bell peppers",
    veg: true,
    category: "Chinese Main course"
  },
  {
    id: "ch-7",
    name: "Veg Hot Garlic Sauce",
    price: 160,
    priceText: "₹160",
    desc: "Veggies cooked in a pungent garlic-chilli sauce",
    veg: true,
    category: "Chinese Main course"
  },
  {
    id: "ch-8",
    name: "Mushroom Chilli",
    price: 170,
    priceText: "₹170",
    desc: "Crispy mushroom tossed with chillies and soy",
    veg: true,
    category: "Chinese Main course"
  },
  {
    id: "ch-9",
    name: "Veg in Black Bean Sauce",
    price: 180,
    priceText: "₹180",
    desc: "Mixed vegetables and tofu in fermented black bean sauce",
    veg: true,
    category: "Chinese Main course"
  },
  {
    id: "ch-10",
    name: "Triple Schezwan Rice",
    price: 190,
    priceText: "₹190",
    desc: "Layered rice, noodles and gravy with schezwan flavor",
    veg: true,
    category: "Chinese Main course"
  },
  {
    id: "ch-11",
    name: "American Chop Suey",
    price: 150,
    priceText: "₹150",
    desc: "Crispy noodles topped with a sweet and sour vegetable sauce",
    veg: true,
    category: "Chinese Main course"
  },
  {
    id: "ch-12",
    name: "Pan Fried Noodles",
    price: 170,
    priceText: "₹170",
    desc: "Crispy noodles with stir fried vegetables in a light gravy",
    veg: true,
    category: "Chinese Main course"
  },
  {
    id: "ch-13",
    name: "Veg Singapore Noodles",
    price: 160,
    priceText: "₹160",
    desc: "Thin rice noodles stir-fried with curry powder and vegetables",
    veg: true,
    category: "Chinese Main course"
  }
];

// -------------------------------------------------------
// Italian Pizza and Pasta (4 items)
export const italianItems = [
  {
    id: "italy-1",
    name: "Margherita Pizza (10”)",
    price: 220,
    priceText: "₹220",
    desc: "Classic pizza with mozzarella, fresh basil and tomato sauce",
    veg: true,
    category: "Italian Pizza and Pasta"
  },
  {
    id: "italy-2",
    name: "Veg Delight Pizza (10”)",
    price: 260,
    priceText: "₹260",
    desc: "Loaded with bell peppers, onions, sweet corn and olives",
    veg: true,
    category: "Italian Pizza and Pasta"
  },
  {
    id: "italy-3",
    name: "Pasta Alfredo",
    price: 190,
    priceText: "₹190",
    desc: "Penne in a rich creamy white sauce with veggies",
    veg: true,
    category: "Italian Pizza and Pasta"
  },
  {
    id: "italy-4",
    name: "Pasta Arrabiata",
    price: 180,
    priceText: "₹180",
    desc: "Spicy tomato sauce tossed with penne and garlic",
    veg: true,
    category: "Italian Pizza and Pasta"
  }
];

// -------------------------------------------------------
// Rice (3 items)
export const riceItems = [
  {
    id: "rice-1",
    name: "Jeera Rice",
    price: 110,
    priceText: "₹110",
    desc: "Basmati rice tempered with cumin seeds",
    veg: true,
    category: "Rice"
  },
  {
    id: "rice-2",
    name: "Veg Biryani",
    price: 170,
    priceText: "₹170",
    desc: "Fragrant basmati rice cooked with vegetables and biryani masala",
    veg: true,
    category: "Rice"
  },
  {
    id: "rice-3",
    name: "Plain Rice",
    price: 80,
    priceText: "₹80",
    desc: "Steamed basmati rice",
    veg: true,
    category: "Rice"
  }
];

// -------------------------------------------------------
// Breads (7 items)
export const breadItems = [
  {
    id: "bread-1",
    name: "Tandoori Roti",
    price: 15,
    priceText: "₹15",
    desc: "Whole wheat bread baked in tandoor",
    veg: true,
    category: "Breads"
  },
  {
    id: "bread-2",
    name: "Plain Naan",
    price: 30,
    priceText: "₹30",
    desc: "Soft leavened bread from tandoor",
    veg: true,
    category: "Breads"
  },
  {
    id: "bread-3",
    name: "Butter Naan",
    price: 40,
    priceText: "₹40",
    desc: "Naan topped with butter",
    veg: true,
    category: "Breads"
  },
  {
    id: "bread-4",
    name: "Garlic Naan",
    price: 50,
    priceText: "₹50",
    desc: "Naan flavored with fresh garlic and coriander",
    veg: true,
    category: "Breads"
  },
  {
    id: "bread-5",
    name: "Lachha Paratha",
    price: 45,
    priceText: "₹45",
    desc: "Layered whole wheat bread cooked in tandoor",
    veg: true,
    category: "Breads"
  },
  {
    id: "bread-6",
    name: "Missi Roti",
    price: 35,
    priceText: "₹35",
    desc: "Gram flour and whole wheat spiced flatbread",
    veg: true,
    category: "Breads"
  },
  {
    id: "bread-7",
    name: "Pudina Paratha",
    price: 45,
    priceText: "₹45",
    desc: "Whole wheat paratha with mint leaves",
    veg: true,
    category: "Breads"
  }
];

// -------------------------------------------------------
// Boxes (1 item)
export const boxItems = [
  {
    id: "box-1",
    name: "Executive Lunch Box",
    price: 250,
    priceText: "₹250",
    desc: "Dal makhani, paneer sabzi, 2 roti, rice, salad, sweet",
    veg: true,
    category: "Boxes"
  }
];

// -------------------------------------------------------
// Drinks (Beverages) (20 items)
export const drinkItems = [
  {
    id: "drink-1",
    name: "Sweet Lassi",
    price: 60,
    priceText: "₹60",
    desc: "Creamy sweet yoghurt drink",
    veg: true,
    category: "Drinks (Beverages)"
  },
  {
    id: "drink-2",
    name: "Salted Lassi",
    price: 55,
    priceText: "₹55",
    desc: "Refreshing salted yoghurt drink with cumin",
    veg: true,
    category: "Drinks (Beverages)"
  },
  {
    id: "drink-3",
    name: "Cold Coffee",
    price: 90,
    priceText: "₹90",
    desc: "Chilled coffee blended with milk and sugar",
    veg: true,
    category: "Drinks (Beverages)"
  },
  {
    id: "drink-4",
    name: "Fresh Lime Soda (Sweet/Salted)",
    price: 50,
    priceText: "₹50",
    desc: "Sparkling lime drink, sweet or salty",
    veg: true,
    category: "Drinks (Beverages)"
  },
  {
    id: "drink-5",
    name: "Masala Chaas",
    price: 45,
    priceText: "₹45",
    desc: "Spiced buttermilk with ginger and coriander",
    veg: true,
    category: "Drinks (Beverages)"
  },
  {
    id: "drink-6",
    name: "Soft Drink (300ml)",
    price: 40,
    priceText: "₹40",
    desc: "Coke, Sprite, Fanta etc.",
    veg: true,
    category: "Drinks (Beverages)"
  },
  {
    id: "drink-7",
    name: "Bottled Water (1L)",
    price: 20,
    priceText: "₹20",
    desc: "Packaged drinking water",
    veg: true,
    category: "Drinks (Beverages)"
  },
  {
    id: "drink-8",
    name: "Mango Lassi",
    price: 80,
    priceText: "₹80",
    desc: "Seasonal mango blended with yoghurt",
    veg: true,
    category: "Drinks (Beverages)"
  },
  {
    id: "drink-9",
    name: "Strawberry Shake",
    price: 100,
    priceText: "₹100",
    desc: "Thick shake with fresh strawberries and ice cream",
    veg: true,
    category: "Drinks (Beverages)"
  },
  {
    id: "drink-10",
    name: "Chocolate Shake",
    price: 100,
    priceText: "₹100",
    desc: "Creamy chocolate shake topped with chocolate syrup",
    veg: true,
    category: "Drinks (Beverages)"
  },
  {
    id: "drink-11",
    name: "Oreo Shake",
    price: 110,
    priceText: "₹110",
    desc: "Blended oreo cookies with milk and ice cream",
    veg: true,
    category: "Drinks (Beverages)"
  },
  {
    id: "drink-12",
    name: "Iced Tea (Lemon/Peach)",
    price: 70,
    priceText: "₹70",
    desc: "Chilled tea with lemon or peach flavor",
    veg: true,
    category: "Drinks (Beverages)"
  },
  {
    id: "drink-13",
    name: "Virgin Mojito",
    price: 90,
    priceText: "₹90",
    desc: "Mint, lime, sugar and soda, refreshing mocktail",
    veg: true,
    category: "Drinks (Beverages)"
  },
  {
    id: "drink-14",
    name: "Blue Lagoon",
    price: 100,
    priceText: "₹100",
    desc: "Blue citrus-based fizzy mocktail",
    veg: true,
    category: "Drinks (Beverages)"
  },
  {
    id: "drink-15",
    name: "Pina Colada (Non-Alcoholic)",
    price: 120,
    priceText: "₹120",
    desc: "Pineapple and coconut cream mocktail",
    veg: true,
    category: "Drinks (Beverages)"
  },
  {
    id: "drink-16",
    name: "Kiwi Cooler",
    price: 110,
    priceText: "₹110",
    desc: "Kiwi blend with mint and soda",
    veg: true,
    category: "Drinks (Beverages)"
  },
  {
    id: "drink-17",
    name: "Watermelon Juice",
    price: 80,
    priceText: "₹80",
    desc: "Freshly pressed watermelon juice with a hint of mint",
    veg: true,
    category: "Drinks (Beverages)"
  },
  {
    id: "drink-18",
    name: "Mixed Fruit Juice",
    price: 100,
    priceText: "₹100",
    desc: "Blend of seasonal fruits",
    veg: true,
    category: "Drinks (Beverages)"
  },
  {
    id: "drink-19",
    name: "Hot Coffee",
    price: 60,
    priceText: "₹60",
    desc: "Classic filter coffee with milk",
    veg: true,
    category: "Drinks (Beverages)"
  },
  {
    id: "drink-20",
    name: "Hot Tea",
    price: 30,
    priceText: "₹30",
    desc: "Indian masala chai",
    veg: true,
    category: "Drinks (Beverages)"
  }
];

// Convenience: thalis + combos together, if you want one list as the fallback.
// Now includes all newly added categories as well.
export const allStaticItems = [
  ...thaliItems,
  ...staticCombos,
  ...snacksItems,
  ...startersItems,
  ...northIndianItems,
  ...chineseItems,
  ...italianItems,
  ...riceItems,
  ...breadItems,
  ...boxItems,
  ...drinkItems
];