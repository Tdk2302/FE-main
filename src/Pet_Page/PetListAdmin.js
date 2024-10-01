import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios, { BASE_URL } from '../services/axios';
import '../styles/petslist.scss';

const PetListAdmin = () => {
    const [pets, setPets] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [petsPerPage] = useState(8);
    const [searchParams, setSearchParams] = useState({
        name: "",
        age: "",
        categoryID: 0,
        sex: ""
    });
    const [ageError, setAgeError] = useState("");
    const[noResults, setNoResults] = useState(false);


    const navigate = useNavigate();

    useEffect(() => {
        const checkRole = async () => {
            const roleID = localStorage.getItem("roleID");
            try {
                if (roleID === "1") {
                    await apiListAllPets();
                }
            } catch (error) {
                console.error("Error fetching pets:", error);
            }
        };
        checkRole();
    }, [navigate]);

    const apiListAllPets = async () => {
        try {
            const response = await axios.get("/pets/showListAllOfPets");
            setPets(response.data);
        } catch (error) {
            console.error("Error fetching all pets:", error);
            if (error.code === 'ERR_NETWORK') {
                console.error("Network error. Please check if the backend server is running on port 8081.");
            }
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const searchData = {
                name: searchParams.name || "",
                age: searchParams.age ? parseFloat(searchParams.age) : 0,
                categoryID: searchParams.categoryID || 0,
                sex: searchParams.sex || ""
            };
            const response = await axios.get('/pets/searchByNameAndBreedAdmin', { params: searchData });
            if (response.data.length === 0) {
            setNoResults(true);
            setPets([]);
            } else {
            setNoResults(false);
            setPets(response.data);
          }
        } catch (error) {
          console.error("Error searching pets:", error);
          setNoResults(true);
          setPets([]);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'age') {
            const floatValue = parseFloat(value);
            if (value === "" || (floatValue >= 1 && !isNaN(floatValue))) {
                setSearchParams(prevParams => ({
                    ...prevParams,
                    [name]: value
                }));
                setAgeError("");
            } else {
                setAgeError("Age must be 1 or greater");
            }
        } else {
            setSearchParams(prevParams => ({
                ...prevParams,
                [name]: name === 'categoryID' ? (value === '' ? 0 : parseInt(value)) : value
            }));
        }
    };

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
                    type="number"
                    name="age"
                    value={searchParams.age}
                    onChange={handleInputChange}
                    placeholder="Select Age"
                    step="1"
                    min="1"
                />
                <select 
                    name="categoryID"
                    value={searchParams.categoryID}
                    onChange={handleInputChange}
                >
                    <option value={0}>Select category</option>
                    <option value={1}>Dog</option>
                    <option value={2}>Cat</option>
                </select>
                <select 
                    name="sex"
                    value={searchParams.sex}
                    onChange={handleInputChange}
                >
                    <option value="">Select Sex</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
                <button type="submit" disabled={ageError !== ""}>Search</button>
               
            </form>
            <div className="pets-grid">
                {currentPets.length > 0 ? currentPets.map((pet) => (
                    <div key={pet.petID} className="pet-item">
                        <img src={getImageUrl(pet.img_url)} alt={pet.name} />
                        <h3>{pet.name}</h3>
                        <p>Age: {pet.age}</p>
                        <p>Sex: {pet.sex}</p>
                    </div>
                )) : <p>No pets found</p>}
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

export default PetListAdmin;