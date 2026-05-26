import { useState, useEffect } from "react";
import { supabase } from "../../services/supabase-client";
import { FaPlus } from "react-icons/fa";

const SkillsSection = ({ user }) => {
    const [skills, setSkills] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (user?.skills) {
            setSkills(user.skills);
        }
    }, [user]);

    const saveSkillsToDB = async (updatedSkills) => {
        setSaving(true);
        const { error } = await supabase
            .schema('me_dataspace')
            .from('users')
            .update({ skills: updatedSkills })
            .eq('emailID', user.emailID)
            .select();

        if (error) console.error('Error saving skills:', error);
        setSaving(false);
    };

    const addSkill = () => {
        if (inputValue.trim()) {
            const updated = [...skills, inputValue.trim()];
            setSkills(updated);
            setInputValue('');
            saveSkillsToDB(updated);
        }
    };

    const removeSkill = (index) => {
        const updated = skills.filter((_, i) => i !== index);
        setSkills(updated);
        saveSkillsToDB(updated);
    };

    return (
        <div className="bg-white rounded-2xl p-6 flex flex-col h-80">
            <h2 className="text-2xl font-bold mb-4 text-[#8A7060]">
                Skills 
            </h2>

            <div className="flex flex-wrap gap-2 mb-4 overflow-y-auto flex-1 content-start">
                {skills.map((skill, index) => (
                    <span key={index} className="bg-[#F5EDE0] text-[#8A7060] px-3 py-1 rounded-full text-sm flex items-center gap-2">
                        {skill}
                        <button onClick={() => removeSkill(index)}>×</button>
                    </span>
                ))}
            </div>

            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                    placeholder="Add a skill..."
                    className="flex-1 px-3 py-2 border rounded"
                />
                <button onClick={addSkill} className="px-4 py-2 text-[#A64200] rounded-xl border border-[#A64200]">
                    <FaPlus className="inline" /> Add
                </button>
            </div>
        </div>
    );
};

export default SkillsSection;