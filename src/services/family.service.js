import { Family } from "../models/family.model.js";

export const createFamily = async (data) => {
    const family = new Family(data);
    await family.save();
    return {
        family: {
            id: family._id,
            name: family.name,
            city: family.city,
            slogan: family.slogan,
            themes: family.themes,
        }
    };
};

export const searchFamilies = async (search) => {
    const families = await Family.find({
        name: { $regex: search, $options: 'i' }
    }).limit(20);

    return families.map(family => ({
        id: family._id,
        name: family.name,
        city: family.city,
        slogan: family.slogan,
        themes: family.themes,
    }));
};

export const getFamily = async (familyId) => {
    const family = await Family.findById(familyId);
    return {
        family: {
            id: family._id,
            name: family.name,
            city: family.city,
            slogan: family.slogan,
            themes: family.themes,
        }
    };
};

export const updateFamily = async (familyId, updateData) => {
    const updatedFamily = await Family.findByIdAndUpdate(
        familyId,
        { $set: updateData },
        { new: true, runValidators: true }
    );

    if (!updatedFamily) throw new Error('Famille non trouvé.');
  
    return updatedFamily;
};

export const deleteFamily = async (familyId) => {
    return await Family.findByIdAndDelete(familyId);
};