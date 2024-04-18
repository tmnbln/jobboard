import { JobOffer } from "./job-offer.model";

export class Column {
    constructor (public name: string, public jobOffer: JobOffer[]) {}
}