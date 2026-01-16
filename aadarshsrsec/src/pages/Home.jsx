import React, { useEffect, useState } from "react";

// --- Services (The bridge to Firebase) ---
import { 
  getBanners, 
  getSchoolSectionData, 
  getAnnualFunctionData,
  getGridData,
  getInfraData,
  getLeadershipData, 
  getAboutPageData,
  getPrincipalPageData
} from '../services/content.service';

// --- Components ---
// Ensure these filenames match exactly what you created in src/components/
import HeroCarousel from "../components/HeroCarousel";
import SchoolSection from "../components/schoolsection"; 
import LeadershipSection from "../components/Leadership"; 
import Grid from "../components/BentoGrid";
import SchoolInfrastructure from "../components/Infrastructure";
import AnnualFunction from "../components/annualfunction";

// --- Fallback Images (Safety net) ---
import img3 from "../assets/banner1.jpg";
import img4 from "../assets/banner2.jpg";
import img5 from "../assets/banner3.jpg";
import img6 from "../assets/banner4.jpg";
import img7 from "../assets/banner5.jpg";
import img8 from "../assets/banner6.jpg";

const STATIC_BANNERS = [img3, img4, img5, img6, img7, img8];


const Home = () => {
    const [banners, setBanners] = useState([]);
    
    // We now have 3 pieces of data for the School Section
    const [aboutPageData, setAboutPageData] = useState(null);
    const [principalPageData, setPrincipalPageData] = useState(null);
    const [schoolMiscData, setSchoolMiscData] = useState(null); // For flag/notices

    const [gridData, setGridData] = useState(null);
    const [infraData, setInfraData] = useState(null);
    const [annualData, setAnnualData] = useState(null);
    const [leadershipData, setLeadershipData] = useState([]); 
    const [loading, setLoading] = useState(true);

    const fetchContent = async () => {
        try {
            const [
                bannersData, 
                aboutRes, 
                principalRes,
                schoolMiscRes,
                gridDataRes, 
                infraDataRes,
                annualFunctionData,
                leadershipRes 
            ] = await Promise.all([
                getBanners(),
                getAboutPageData(),      // Fetch About
                getPrincipalPageData(),  // Fetch Principal
                getSchoolSectionData(),  // Fetch Misc (Flag, Notices)
                getGridData(),
                getInfraData(),
                getAnnualFunctionData(),
                getLeadershipData() 
            ]);

            setBanners(bannersData && bannersData.length > 0 ? bannersData : STATIC_BANNERS);
            
            // Set individual states
            setAboutPageData(aboutRes);
            setPrincipalPageData(principalRes);
            setSchoolMiscData(schoolMiscRes);

            setGridData(gridDataRes);
            setInfraData(infraDataRes);
            setAnnualData(annualFunctionData);
            setLeadershipData(leadershipRes || []); 

        } catch (error) {
            console.error("Failed to load content:", error);
            setBanners(STATIC_BANNERS); 
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContent();
    }, []);

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full max-w-full bg-white p-0 overflow-y-hidden overflow-x-hidden">
            
            <HeroCarousel 
                banners={banners} 
                refreshData={fetchContent} 
            /> 
            
            {/* PASS ALL 3 DATA SOURCES */}
            <SchoolSection 
                aboutData={aboutPageData}
                principalData={principalPageData}
                miscData={schoolMiscData}
                refreshData={fetchContent} 
            />

            <LeadershipSection 
                initialData={leadershipData} 
                refreshData={fetchContent} 
            />

            <Grid 
                data={gridData} 
                refreshData={fetchContent} 
            />

            <SchoolInfrastructure 
                data={infraData} 
                refreshData={fetchContent} 
            /> 

            <AnnualFunction 
                data={annualData} 
                refreshData={fetchContent} 
            />

        </div>
    );
};

export default Home;