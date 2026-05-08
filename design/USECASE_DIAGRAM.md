# Use Case Diagram - WeConnect

Biểu đồ dưới đây được tổng hợp từ tài liệu SRS WeConnect (các yêu cầu chức năng ID 3-18), tập trung vào các tương tác chính giữa actor và hệ thống.

![WeConnect Use Case Diagram](./USECASE_DIAGRAM.png)

```mermaid
flowchart LR
  %% Actor zones
  subgraph actors_left[ ]
    direction TB
    user["Nguoi dung / Nguoi muon ket ban"]
    otp["He thong OTP ben thu 3"]
    trans["Dich vu dich thuat ben thu 3"]
  end

    %% System Boundary
    subgraph weconnect[He thong WeConnect]
    uc_home((Trang chu))
        uc_register((Dang ky tai khoan))
        uc_login((Dang nhap))
        uc_forgot((Quen mat khau))
        uc_verify_otp((Xac thuc OTP))
        uc_profile((Quan ly ho so ca nhan))

        uc_search((Tim kiem nguoi dung))
        uc_filter((Loc ket qua tim kiem))
        uc_suggest((Nhan goi y ket ban))

        uc_send_friend((Gui loi moi ket ban))
        uc_manage_invite((Quan ly loi moi ket ban))
        uc_manage_friend((Quan ly ban be / Huy ket ban))

        uc_chat((Nhan tin realtime))
        uc_call((Goi audio/video))
        uc_translate((Dich tin nhan Nhat-Viet))
        uc_language((Chuyen doi ngon ngu hien thi))

        uc_event_join((Tim kiem va dang ky su kien))
        uc_game((Tham gia game room))
        uc_game_create((Tao phong game))
        uc_game_random((Tham gia ngau nhien))
        uc_game_code((Nhap ma phong))
        uc_game_chat((Chat realtime trong phong game))

        uc_event_crud((Tao/Sua/Xoa su kien))
        uc_event_stats((Xem thong ke su kien))
    end

      subgraph actors_right[ ]
        direction TB
        organizer["Nguoi to chuc su kien"]
      end

    %% User interactions
      user --> uc_home
    user --> uc_register
    user --> uc_login
    user --> uc_forgot
    user --> uc_profile

    user --> uc_search
    user --> uc_suggest

    user --> uc_send_friend
    user --> uc_manage_invite
    user --> uc_manage_friend

    user --> uc_chat
    user --> uc_call
    user --> uc_language

    user --> uc_event_join
    user --> uc_game

    %% Organizer interactions
    organizer --> uc_event_crud
    organizer --> uc_event_stats

    %% Include/extend style relations
    uc_home -. include .-> uc_suggest
    uc_register -. include .-> uc_verify_otp
    uc_forgot -. include .-> uc_verify_otp
    uc_chat -. include .-> uc_translate
    %% Precondition note removed from diagram arrows; see Ghi chu below
    uc_suggest --> uc_send_friend
    uc_search -. extend .-> uc_filter
    uc_game_create -.->|extend| uc_game
    uc_game_random -.->|extend| uc_game
    uc_game_code -.->|extend| uc_game
    uc_game -. include .-> uc_game_chat

    %% External integrations
    otp --> uc_verify_otp
    trans --> uc_translate

    %% Keep actor containers visually neutral
    style actors_left fill:transparent,stroke:transparent
    style actors_right fill:transparent,stroke:transparent
```

## Ghi chu

- Actor chinh: Nguoi dung / Nguoi muon ket ban, Nguoi to chuc su kien.
- OTP la buoc bat buoc (include) cho Dang ky va Quen mat khau.
- Dang nhap khong include OTP theo SRS hien tai.
- Nhan goi y ket ban duoc the hien la include tu Trang chu.
- Precondition cho Nhan tin: hai ben phai la ban be (dependency, ghi chu - khong phai mui ten tu Nhan tin sang Quan ly ban be).
- Game room duoc chi tiet hoa thanh 3 cach vao phong: Tao phong, Tham gia ngau nhien, Nhap ma phong.
