import { toBuilderMethod } from 'class-constructor';

export class NumericId {
  constructor(private value: number) {}

  public static fromString(value: string) {
    return new NumericId(parseInt(value));
  }

  public toString() {
    return this.value.toString().padStart(4, '0');
  }
}

export class AdrStatus {
  private readonly _value: string;
  private readonly _label: string;

  private constructor(value: string, label: string) {
    this._value = value;
    this._label = label;
  }

  public get value() {
    return this._value;
  }

  public get label() {
    return this._label;
  }

  public static create(value: string, label: string) {
    return new AdrStatus(value, label);
  }

  public static proposed() {
    return new AdrStatus('proposed', 'Proposed');
  }

  public static accepted() {
    return new AdrStatus('accepted', 'Accepted');
  }
}

export class AdrTimestamp {
  private readonly _date: Date;

  private constructor(date: Date) {
    this._date = date;
  }

  public get value() {
    return new Date(this._date);
  }

  public static create(value: Date) {
    return new AdrTimestamp(value);
  }

  public static now() {
    return new AdrTimestamp(new Date());
  }
}

export class LinkDirection {
  private readonly _label: string;
  private readonly _changeStatusTo: string;

  private constructor(label: string, changeStatusTo: string) {
    this._label = label;
    this._changeStatusTo = changeStatusTo;
  }

  public get label() {
    return this._label;
  }

  public get changeStatusTo() {
    return this._changeStatusTo;
  }

  public static create(label: string, changeStatusTo: string) {
    return new LinkDirection(label, changeStatusTo);
  }
}

export class AdrLink {
  private readonly _alias: string;
  private readonly _title: string;
  private readonly _targetDirection: LinkDirection;
  private readonly _sourceDirection: LinkDirection;

  private constructor(alias: string, title: string, targetDirection: LinkDirection, sourceDirection: LinkDirection) {
    this._alias = alias;
    this._title = title;
    this._targetDirection = targetDirection;
    this._sourceDirection = sourceDirection;
  }

  public get alias() {
    return this._alias;
  }

  public get title() {
    return this._title;
  }

  public get targetDirection() {
    return this._targetDirection;
  }

  public get sourceDirection() {
    return this._sourceDirection;
  }

  public static create(alias: string, title: string, targetDirection: LinkDirection, sourceDirection: LinkDirection) {
    return new AdrLink(alias, title, targetDirection, sourceDirection);
  }
}

export class AdrRelation {
  private readonly _id: string;
  private readonly _sourceId: NumericId;
  private readonly _targetId: NumericId;
  private readonly _link: AdrLink;

  constructor(sourceId: NumericId, targetId: NumericId, link: AdrLink) {
    this._id = sourceId.toString() + targetId.toString() + link.alias;
    this._sourceId = sourceId;
    this._targetId = targetId;
    this._link = link;
  }

  public get id() {
    return this._id;
  }

  public get sourceId() {
    return this._sourceId;
  }

  public get targetId() {
    return this._targetId;
  }

  public get link() {
    return this._link;
  }
}

interface AdrBuilderOptionals {
  title?: string;
  context?: string;
  decisions?: string;
  consequences?: string;
  timestamp?: AdrTimestamp;
}

export class Adr {
  private readonly _id: NumericId;
  private readonly _status: AdrStatus;
  private readonly _title: string = 'TITLE';
  private readonly _context: string = 'CONTEXT';
  private readonly _decisions: string = 'DECISIONS';
  private readonly _consequences: string = 'CONSEQUENCES';

  private readonly _relations: AdrRelation[] = [];

  private readonly _timestamp: AdrTimestamp = AdrTimestamp.now();

  constructor(id: NumericId, status: AdrStatus) {
    this._id = id;
    this._status = status;
  }

  public static builder = toBuilderMethod(Adr).withOptionals<AdrBuilderOptionals>();

  public associateWith(target: Adr, link: AdrLink) {
    const relation = new AdrRelation(this._id, target._id, link);
    this._relations.push(relation);
    target._relations.push(relation);
  }

  public get id() {
    return this._id;
  }

  public get status() {
    return this._status;
  }

  public get title() {
    return this._title;
  }

  public get context() {
    return this._context;
  }

  public get decisions() {
    return this._decisions;
  }

  public get consequences() {
    return this._consequences;
  }

  public get relations(): ReadonlyArray<AdrRelation> {
    return this._relations;
  }
}
