
    drop table if exists subject_role;

    drop table if exists `user`;

    create table subject_role (
        id integer not null auto_increment,
        created_at datetime not null,
        last_updated_at datetime not null,
        type varchar(255) not null,
        user_id integer not null,
        primary key (id)
    );

    create table `user` (
        id integer not null auto_increment,
        birthday date,
        city_id bigint,
        created_at datetime not null,
        district_id bigint,
        email varchar(190) not null,
        external_id varchar(255),
        first_name varchar(40) not null,
        gender varchar(255),
        last_name varchar(40) not null,
        last_updated_at datetime not null,
        password varchar(255) not null,
        permit_email bit,
        permit_notification bit,
        permit_sms bit,
        phone_number varchar(190),
        registration_channel varchar(255),
        salt varchar(255),
        town_id bigint,
        primary key (id)
    );

    alter table `user` 
        add constraint user_email_uk unique (email);

    alter table `user` 
        add constraint user_phone_number_uk unique (phone_number);
