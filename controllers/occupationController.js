const axios = require('axios');
const cheerio = require('cheerio');

const GOV_URL = 'https://www.gov.uk/government/publications/skilled-worker-visa-going-rates-for-eligible-occupations/skilled-worker-visa-going-rates-for-eligible-occupation-codes';

exports.getOccupations = async (req, res) => {
    try {
        const { data } = await axios.get(GOV_URL);
        const $ = cheerio.load(data);
        const occupations = [];

        $('table tbody tr').each((index, element) => {
            const cells = $(element).find('th, td');
            
            if (cells.length >= 4) {
                const code = $(cells[0]).text().trim();
                const type = $(cells[1]).text().trim();
                
                let relatedTitles = "N/A";
                let standardRate = "";
                let lowerRate = "";

                if (cells.length >= 5) {
                    relatedTitles = $(cells[2]).text().trim();
                    standardRate = $(cells[3]).text().trim();
                    lowerRate = $(cells[4]).text().trim();
                } else {
                    standardRate = $(cells[2]).text().trim();
                    lowerRate = $(cells[3]).text().trim();
                }

                const isEligible = standardRate.toLowerCase().includes('ineligible') ? 'No' : 'Yes';

                occupations.push({
                    code: code,
                    type: type,
                    related_titles: relatedTitles,
                    eligible: isEligible,
                    standard_rate: standardRate,
                    lower_rate: lowerRate
                });
            }
        });

        res.json({
            total: occupations.length,
            data: occupations
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch data from GOV.UK' });
    }
};