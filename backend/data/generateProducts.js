const fs = require('fs');
const path = require('path');

// Curated list of high-quality Unsplash fashion photo IDs
const imageMap = {
  Men: {
    Top: [
      "photo-1521572267360-ee0c2909d518", // White Tee
      "photo-1596755094514-f87e34085b2c", // Pattern shirt
      "photo-1583743814966-8936f5b7be1a", // Black Tee
      "photo-1617137984095-74e4e5e3613f", // Blue Polo
      "photo-1602810318383-e386cc2a3ccf", // Casual shirt
      "photo-1603252109303-2751441dd157", // White shirt
    ],
    Bottom: [
      "photo-1541099649105-f69ad21f3246", // Blue jeans
      "photo-1604176354204-9268737828e4", // Dark jeans
      "photo-1485968579580-b6d095142e6e", // Chinos
      "photo-1582562124811-c09040d0a901", // Cargo shorts
    ]
  },
  Women: {
    Top: [
      "photo-1554568218-0f1715e72254", // Casual top
      "photo-1434389677669-e08b4cac3105", // Knit top
      "photo-1585487000160-6ebcfceb0d03", // Blazer
      "photo-1525507119028-ed4c629a60a3", // Summer top
    ],
    Bottom: [
      "photo-1509319117193-57bab727e09d", // Skirt
      "photo-1594633312681-425c7b97ccd1", // Wide pants
      "photo-1576995853123-5a10305d93c0", // Jeans women
    ]
  },
  Unisex: {
    Top: [
      "photo-1576566588028-4147f3842f27", // Sweatshirt
      "photo-1556905055-8f358a7a47b2", // Hoodie
      "photo-1551799517-eb8f03cb5e6a", // Casual outerwear
    ],
    Bottom: [
      "photo-1551854838-212c50b4c184", // Track pants
      "photo-1506152983158-b4a74a01c721", // Cargo
    ]
  }
};

const getUnsplashUrl = (photoId) => `https://images.unsplash.com/${photoId}?q=80&w=600&auto=format&fit=crop`;

// Core templates of clothes
const templates = [
  {
    name: "Áo Thun Cotton Cổ Tròn Routine",
    description: "Áo thun Routine với chất liệu 100% cotton tự nhiên, mềm mại, thoáng mát và co giãn tốt. Thiết kế cổ tròn basic năng động, dễ dàng phối cùng quần jeans, quần short cho những buổi dạo phố, đi làm hay gặp gỡ bạn bè.",
    price: 180000,
    category: "Top Wear",
    brand: "Routine",
    material: "Cotton",
    gender: "Unisex"
  },
  {
    name: "Áo Polo Nam Thể Thao Coolmate",
    description: "Áo polo thể thao nam Coolmate sử dụng công nghệ Quick-Dry giúp thấm hút mồ hôi nhanh chóng, giữ cho cơ thể luôn khô thoáng và mát mẻ. Form dáng regular-fit vừa vặn, lịch sự nhưng vẫn rất trẻ trung, hiện đại.",
    price: 250000,
    category: "Top Wear",
    brand: "Coolmate",
    material: "Polyester",
    gender: "Men"
  },
  {
    name: "Quần Kaki Dài Ống Đứng Canifa",
    description: "Quần kaki nam Canifa ống đứng thanh lịch, chất vải kaki mềm cao cấp bền màu, ít nhăn và giữ form cực tốt. Phù hợp cho nam giới mặc đi học, đi làm công sở hoặc đi sự kiện trang trọng.",
    price: 450000,
    category: "Bottom Wear",
    brand: "Canifa",
    material: "Kaki Cotton",
    gender: "Men"
  },
  {
    name: "Quần Short Kaki Nam Basic Routine",
    description: "Quần short Kaki basic từ Routine mang lại sự thoải mái tối đa trong các hoạt động thường ngày. Chất kaki co giãn nhẹ, phối màu trung tính dễ mặc, thích hợp mang cùng áo phông hoặc sơ mi cộc tay.",
    price: 220000,
    category: "Bottom Wear",
    brand: "Routine",
    material: "Kaki",
    gender: "Men"
  },
  {
    name: "Áo Sơ Mi Tay Dài Oxford Routine",
    description: "Áo sơ mi dài tay chất liệu Oxford Routine dày dặn, đứng form và thoáng khí. Kiểu dáng công sở chỉn chu nhưng không kém phần thanh lịch, là lựa chọn lý tưởng cho các buổi họp quan trọng.",
    price: 380000,
    category: "Top Wear",
    brand: "Routine",
    material: "Cotton Oxford",
    gender: "Men"
  },
  {
    name: "Quần Tây Nam Slimfit An Phước",
    description: "Quần tây nam thương hiệu cao cấp An Phước với form dáng slimfit hiện đại, tôn dáng chân. Chất liệu vải tây cao cấp phẳng phiu, chống bám bụi và tạo cảm giác dễ chịu khi vận động cả ngày dài.",
    price: 750000,
    category: "Bottom Wear",
    brand: "An Phước",
    material: "Polyester pha Viscose",
    gender: "Men"
  },
  {
    name: "Đầm Voan Hoa Nhí Dáng Suông Ivy Moda",
    description: "Đầm nữ dáng suông nhẹ nhàng từ Ivy Moda, may bằng chất voan cát tơ mềm bay bổng có lớp lót trong kín đáo. Họa tiết hoa nhí vintage dịu mắt giúp phái đẹp thêm phần duyên dáng, nữ tính khi đi chơi hay đi tiệc nhẹ.",
    price: 890000,
    category: "Top Wear",
    brand: "Ivy Moda",
    material: "Chiffon",
    gender: "Women"
  },
  {
    name: "Chân Váy Midi Xếp Ly Canifa",
    description: "Chân váy midi xếp ly thanh lịch từ Canifa, độ dài qua gối nữ tính giúp che khuyết điểm chân hiệu quả. Lưng thun co giãn nhẹ mang lại sự thoải mái tối ưu khi mặc cả ngày.",
    price: 320000,
    category: "Bottom Wear",
    brand: "Canifa",
    material: "Polyester",
    gender: "Women"
  },
  {
    name: "Áo Khoác Gió Hai Lớp Canifa Chống Nước",
    description: "Áo khoác gió 2 lớp Canifa cản gió và chống nước nhẹ cực tốt, thích hợp làm áo khoác đi nắng lẫn đi mưa nhẹ mùa thu đông. Thiết kế túi khóa kéo tiện lợi, có nón trùm đầu tháo rời.",
    price: 490000,
    category: "Top Wear",
    brand: "Canifa",
    material: "Nylon/Polyester",
    gender: "Unisex"
  },
  {
    name: "Áo Blazer Nữ Thiết Kế Ivy Moda",
    description: "Áo khoác Blazer nữ dáng dài Ivy Moda sang trọng, may 2 lớp đứng form tôn dáng bờ vai. Thích hợp mặc khoác ngoài váy đầm hay phối cùng quần tây công sở cao cấp.",
    price: 1100000,
    category: "Top Wear",
    brand: "Ivy Moda",
    material: "Wool Blend",
    gender: "Women"
  },
  {
    name: "Quần Jean Nam Slimfit Routine",
    description: "Quần bò nam Routine dáng ôm nhẹ chân trẻ trung, chất denim co giãn 4 chiều mềm mịn không thô ráp. Giặt máy thoải mái không lo phai màu hay bai nhão.",
    price: 480000,
    category: "Bottom Wear",
    brand: "Routine",
    material: "Denim Cotton",
    gender: "Men"
  },
  {
    name: "Áo Hoodie Nữ Form Rộng SSStutter",
    description: "Áo hoodie nỉ bông dày dặn form rộng từ SSStutter, mang phong cách minimalist Hàn Quốc nhẹ nhàng. Phù hợp mặc cặp đôi hoặc dạo phố những ngày đông se lạnh.",
    price: 390000,
    category: "Top Wear",
    brand: "SSStutter",
    material: "Nỉ Bông",
    gender: "Unisex"
  },
  {
    name: "Áo Sơ Mi Nữ Lụa Cổ Đức Ivy Moda",
    description: "Áo sơ mi lụa mềm mượt óng nhẹ từ Ivy Moda, thiết kế cổ Đức truyền thống thanh lịch. Vải lụa mát lịm, mang lại cảm giác dễ chịu tuyệt đối dưới thời tiết mùa hè.",
    price: 650000,
    category: "Top Wear",
    brand: "Ivy Moda",
    material: "Silk",
    gender: "Women"
  },
  {
    name: "Quần Jogger Thun Nỉ Năng Động Coolmate",
    description: "Quần jogger thun nỉ nam Coolmate thun bo gấu co giãn thể thao, thắt dây thun tiện lợi. Thích hợp mặc tập gym, chạy bộ hoặc mặc ở nhà những ngày mát mẻ.",
    price: 290000,
    category: "Bottom Wear",
    brand: "Coolmate",
    material: "Cotton pha",
    gender: "Men"
  },
  {
    name: "Chân Váy Chữ A Công Sở Routine",
    description: "Chân váy chữ A Routine thiết kế tối giản, ôm nhẹ hông và xòe nhẹ phía dưới tôn dáng thon gọn. Phù hợp phối cùng sơ mi cộc tay hay áo thun ôm dáng.",
    price: 280000,
    category: "Bottom Wear",
    brand: "Routine",
    material: "Kaki Cotton",
    gender: "Women"
  }
];

const colors = ["Đen", "Trắng", "Xám", "Xanh Navy", "Beige", "Xanh Olive", "Hồng Pastel", "Đỏ đô"];
const sizes = ["S", "M", "L", "XL", "XXL"];
const collections = ["Thời trang hàng ngày", "Bộ sưu tập Mùa hè", "Phong cách Công sở", "Đồ dạo phố trẻ trung", "Thời trang Thể thao"];

const productsList = [];

// Generate 100 products
for (let i = 0; i < 100; i++) {
  const template = templates[i % templates.length];
  const colorCount = 2 + (i % 3); // 2 to 4 colors per product
  const productColors = [];
  for (let c = 0; c < colorCount; c++) {
    const col = colors[(i + c * 3) % colors.length];
    if (!productColors.includes(col)) {
      productColors.push(col);
    }
  }

  // Pick sizes
  const productSizes = template.category === "Top Wear" ? ["S", "M", "L", "XL", "XXL"] : ["S", "M", "L", "XL"];
  
  // Custom discount price (about 10-20% off for 40% of products)
  const hasDiscount = (i % 5) < 2;
  const originalPrice = template.price + (i % 10) * 10000;
  const discountPrice = hasDiscount ? Math.round((originalPrice * 0.85) / 1000) * 1000 : undefined;

  // Retrieve image IDs based on gender and category
  const genderImages = imageMap[template.gender] || imageMap.Unisex;
  const listKey = template.category === "Top Wear" ? "Top" : "Bottom";
  const imagePool = genderImages[listKey] || imageMap.Unisex.Top;
  
  const mainImageId = imagePool[i % imagePool.length];
  const secImageId = imagePool[(i + 1) % imagePool.length];

  const images = [
    {
      url: getUnsplashUrl(mainImageId),
      altText: `${template.name} - Màu ${productColors[0]} - Mặt trước`
    },
    {
      url: getUnsplashUrl(secImageId),
      altText: `${template.name} - Màu ${productColors[0]} - Mặt sau`
    }
  ];

  const sku = `${template.brand.substring(0, 2).toUpperCase()}-${template.category === "Top Wear" ? "TOP" : "BOT"}-${String(i + 1).padStart(3, '0')}`;

  productsList.push({
    name: `${template.name} v${Math.floor(i / templates.length) + 1}`,
    description: template.description,
    price: originalPrice,
    discountPrice: discountPrice,
    countInStock: 15 + (i % 45),
    sku: sku,
    category: template.category,
    brand: template.brand,
    sizes: productSizes,
    colors: productColors,
    collections: collections[i % collections.length],
    material: template.material,
    gender: template.gender,
    images: images,
    isFeatured: (i % 7) === 0,
    isPublish: true,
    isPublished: true,
    rating: (4.0 + (i % 11) * 0.1).toFixed(1),
    numReviews: String(5 + (i % 45)),
    tags: [template.category.toLowerCase(), template.gender.toLowerCase(), template.brand.toLowerCase()]
  });
}

// Write file content
const fileContent = `const products = ${JSON.stringify(productsList, null, 2)};\n\nmodule.exports = products;\n`;

fs.writeFileSync(path.join(__dirname, 'products.js'), fileContent, 'utf-8');
console.log('Successfully generated 100 products!');
