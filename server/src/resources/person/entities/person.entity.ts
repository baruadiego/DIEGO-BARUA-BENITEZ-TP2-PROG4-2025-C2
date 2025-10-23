import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { type ObjectId } from "mongoose";

@Schema()
export class Person {
    @Prop({isRequired: true, unique: true})
    dni: string;

    @Prop({isRequired: true})
    name: string;

    @Prop({isRequired: true})
    lastname: string;
}

export const PersonSchema = SchemaFactory.createForClass(Person);