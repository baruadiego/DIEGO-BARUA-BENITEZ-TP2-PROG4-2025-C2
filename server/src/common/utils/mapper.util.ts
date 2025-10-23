export class Mapper {
    static toDto<t>(entity: any, fields: (keyof t)[]): t{
        const plain = entity.toObject ? entity.toObject() : entity;
        const dto: any = {};

        for (const key of fields) {
            if (plain[key] !== undefined){
                dto[key] = plain[key];
            }
        }

        return dto as t;
    }

    static toDtoList<t>(entities: any[], fields: (keyof t)[]): t[]{
        return entities.map(e => this.toDto<t>(e, fields));
    }
}