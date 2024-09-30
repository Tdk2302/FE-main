import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios, { BASE_URL } from '../services/axios';
import { useEffect } from "react";
import '../styles/petslist.scss';

const PetsList = () => {
    const [pets, setPets] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [petsPerPage] = useState(8);
    const [searchParams, setSearchParams] = useState({
        name: "",
        breed: "",
        age: 0,
        categoryID: 0,
        sex: ""
    });
    const navigate = useNavigate();

    useEffect(() => {
        const checkRole = async () => {
            const roleID = localStorage.getItem("roleID");
            try {
                if (roleID === "3") {
                    await apiListPets(); 
                }
            } catch (error) {
                console.error("Error pets:", error);
            }
    };
    checkRole();    
    }, [navigate]);

// Gọi API lấy danh sách các pet cho người dùng
const apiListPets = async () => {
    try {
        const response = await axios.get("/pets/showListOfPets");
        setPets(response.data);
    } catch (error) {
        console.error("Error Api pets:", error);
    }
};
// Hàm xử lý khi người dùng nhập thông tin tìm kiếm
const handleSearch = async (e) => {
    e.preventDefault();
    try {
        const searchData = {
            name: searchParams.name || "",
            breed: searchParams.breed || "",
            age: searchParams.age || 0,
            categoryID: searchParams.categoryID || 0,
            sex: searchParams.sex || ""
        };

        const response = await axios.post('/pets/searchByNameAndBreed', searchData);
        setPets(response.data);
    } catch (error) {
        console.error("Error searching pets:", error);
    }
};

const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prevParams => ({
        ...prevParams,
        [name]: name === 'age' || name === 'categoryID' 
            ? (value === '' ? 0 : Number(value)) 
            : value
    }));
};
// Hàm xử lý khi người dùng click vào một pet
    const handlePetClick = (petID) => {
        navigate(`/pet/${petID}`);
    }
// Hàm lấy đường dẫn ảnh từ API
    const getImageUrl = (imgUrl) => {
        if (!imgUrl) return '/path/to/default/image.jpg';
        if (imgUrl.startsWith('images\\')) return `${BASE_URL}${imgUrl.replace('\\', '/')}`;
        return imgUrl;
    };

    const indexOfLastPet = currentPage * petsPerPage;
    const indexOfFirstPet = indexOfLastPet - petsPerPage;
    const currentPets = pets.slice(indexOfFirstPet, indexOfLastPet);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    return (
        <div className="pets-list-container">
            
            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    name="name"
                    value={searchParams.name}
                    onChange={handleInputChange}
                    placeholder="Name"
                />
                <input
                    type="text"
                    name="breed"
                    value={searchParams.breed}
                    onChange={handleInputChange}
                    placeholder="Breed"
                />
                <input
                    type="number"
                    name="age"
                    value={searchParams.age}
                    onChange={handleInputChange}
                    placeholder="Age"
                />
                <select 
                    name="categoryID"
                    value={searchParams.categoryID}
                    onChange={handleInputChange}
                >
                    <option value={0}>All</option>
                    <option value={1}>Dog</option>
                    <option value={2}>Cat</option>
                </select>
                <select 
                    name="sex"
                    value={searchParams.sex}
                    onChange={handleInputChange}
                >
                    <option value="">All</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
                <button type="submit">Search</button>
            </form>
            <div className="pets-grid">
                {currentPets.map((pet) => (
                    <div key={pet.petID} className="pet-item" onClick={() => handlePetClick(pet.petID)}>
                        <img src={getImageUrl(pet.img_url)} alt={pet.name} />
                        <h3>{pet.name}</h3>
                        <p>Breed: {pet.breed}</p>
                        <p>Age: {pet.age}</p>
                        <p>Sex: {pet.sex}</p>
                        <button onClick={() => handlePetClick(pet.petID)}>View</button>
                    </div>
                ))}
            </div>
            <div className="pagination">
                {Array.from({ length: Math.ceil(pets.length / petsPerPage) }, (_, i) => (
                    <button key={i} onClick={() => paginate(i + 1)}>
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default PetsList;