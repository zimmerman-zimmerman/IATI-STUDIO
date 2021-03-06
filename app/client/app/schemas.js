import { Schema, arrayOf, normalize } from 'normalizr'

export const itemSchema = new Schema('items', {
    idAttribute: "_id",
})

export const contextSchema = new Schema('context', {
    idAttribute: "_id"
})

export const visualizationSchema = new Schema('visualizations', {
    idAttribute: "_id",
})

visualizationSchema.define({
    items: arrayOf(itemSchema),
    context: arrayOf(contextSchema),
})

/*
 * For itemFilters
*/

export const RecipientCountrySchema = new Schema('recipient_country', {
    idAttribute: "id"
})
export const RecipientRegionSchema = new Schema('recipient_region', {
    idAttribute: "id"
})
export const SectorSchema = new Schema('sector', {
    idAttribute: "id"
})
export const ReportingOrganisationSchema = new Schema('reporting_organisation', {
    idAttribute: "id"
})
export const itemFilterSchema = new Schema('itemFilters', {
    // recipient_country: arrayOf(RecipientCountrySchema),
    // recipient_region: arrayOf(RecipientRegionSchema),
    // sector: arrayOf(SectorSchema),
    // reporting_organisation: arrayOf(ReportingOrganisationSchema),
})

/*
  For publisher
*/

export const publisherSchema = new Schema('publisher', {
    idAttribute: "_id",
})

/*
 * for Activity
*/

export const description = new Schema('descriptions', {
    idAttribute: "id",
})

export const date = new Schema('date', {
    idAttribute: "id",
})

export const status = new Schema('status', {
    idAttribute: "id",
})

export const contact = new Schema('contact', {
    idAttribute: "id",
})

export const budget = new Schema('budget', {
    idAttribute: "id",
})

export const capital = new Schema('capital', {
    idAttribute: "id",
})

export const transaction = new Schema('transactions', {
    idAttribute: "id",
})

export const recipientRegion = new Schema('recipient_region', {
    idAttribute: "id",
})

export const sector = new Schema('sector', {
    idAttribute: "id",
})

export const location = new Schema('locations', {
    idAttribute: "id",
})

export const policyMarker = new Schema('policy_markers', {
    idAttribute: "id",
})

export const plannedDisbursement = new Schema('planned_disbursements', {
    idAttribute: "id",
})

export const documentLink = new Schema('document_links', {
    idAttribute: "id",
})

export const humanitarianScope = new Schema('humanitarian_scope', {
    idAttribute: "id",
})

export const condition = new Schema('condition', {
    idAttribute: "id",
})

export const result = new Schema('results', {
    idAttribute: "id",
})

export const participatingOrganisation = new Schema('participating_organisations', {
    idAttribute: "id",
})

export const recipientCountry = new Schema('recipient_countries', {
    idAttribute: "id",
})

export const countryBudgetItems = new Schema('country_budget_items', {
    idAttribute: "id",
})

export const relatedActivities = new Schema('related_activities', {
    idAttribute: "id",
})

export const legacyData = new Schema('legacy_data', {
    idAttribute: "id",
})

export const activity = new Schema('activity', {
    idAttribute: "id",
    descriptions: arrayOf(description),
    dates: arrayOf(date),
    status: status,
    document_links: arrayOf(documentLink),
    policy_markers: arrayOf(policyMarker),
    contact_info: arrayOf(contact),
    activity_dates: arrayOf(date),
    humanitarian_scope: arrayOf(humanitarianScope),
    country_budget_items: countryBudgetItems,
    budgets: arrayOf(budget),
    results: arrayOf(result),
    locations: arrayOf(location),
    transactions: arrayOf(transaction),
    condition: arrayOf(condition),
    legacy_data: legacyData,
    planned_disbursements: arrayOf(plannedDisbursement),
    participating_organisations: arrayOf(participatingOrganisation),
    date: arrayOf(date),
    related_activities: arrayOf(relatedActivities),
})


export const Schemas = {
    PUBLISHER: publisherSchema,
    VISUALIZATION: visualizationSchema,
    VISUALIZATION_ARRAY: arrayOf(visualizationSchema),
    ITEM: itemSchema,
    ITEM_ARRAY: arrayOf(itemSchema),
    CONTEXT: contextSchema,
    CONTEXT_ARRAY: arrayOf(contextSchema),
    // ITEM_FILTERS: itemFilterSchema,
    ITEM_FILTERS: {
        recipient_country: arrayOf(RecipientCountrySchema),
        recipient_region: arrayOf(RecipientRegionSchema),
        sector: arrayOf(SectorSchema),
        reporting_organisation: arrayOf(ReportingOrganisationSchema),
    },
}

export default Schemas
