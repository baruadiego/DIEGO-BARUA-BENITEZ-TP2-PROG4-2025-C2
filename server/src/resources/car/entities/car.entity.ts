import { Prop, Schema } from "@nestjs/mongoose";
@Schema()
export class Car {
    @Prop()
    brand: string;

    @Prop()
    model: string;

    @Prop()
    year: number;
}
